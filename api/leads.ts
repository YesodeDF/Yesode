import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { Lead } from '../src/modules/leads/domain/entities/Lead.ts';
import { DomainError } from '../src/modules/leads/domain/exceptions/LeadErrors.ts';
import { InMemoryRateLimiter } from '../src/modules/security/infrastructure/InMemoryRateLimiter.ts';
import { BotTrapValidator } from '../src/modules/security/domain/services/BotTrapValidator.ts';
import { HtmlSanitizer } from '../src/modules/security/infrastructure/HtmlSanitizer.ts';
import { SecurityError, RateLimitExceededError } from '../src/modules/security/domain/exceptions/SecurityErrors.ts';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');
const rateLimiter = InMemoryRateLimiter.getInstance();

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const origin = req.headers.origin || '';
  const allowedOrigins = ['https://yesode.com', 'https://yesode.com.br', 'http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'];
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://yesode.com');
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Client-Timestamp, X-Requested-With');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '127.0.0.1';

  try {
    // 1. Rate Limiting por IP (Max 3 requisições por minuto e 10 por hora)
    rateLimiter.check(clientIp, 'leads_submit_burst', 3, 60);
    rateLimiter.check(clientIp, 'leads_submit_hourly', 10, 3600);

    // 2. Anti-Bot Honeypot + Time-Trap Verification
    const honeypot = req.body?.website_url || req.body?.honeypot;
    const clientTimestamp = parseInt(req.headers['x-client-timestamp'] as string || '0', 10);
    const submitTimeDeltaMs = clientTimestamp > 0 ? (Date.now() - clientTimestamp) : undefined;
    BotTrapValidator.validate({ honeypot, submitTimeDeltaMs });

    // 3. Validação Rica de Domínio
    let lead: Lead;
    try {
      lead = Lead.create(req.body);
    } catch (err: any) {
      if (err instanceof DomainError) {
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(400).json({ success: false, message: 'Dados de lead inválidos.' });
    }

    // 4. Sanitização contra HTML Injection nos e-mails
    const safeName = HtmlSanitizer.escape(lead.name);
    const safeCompany = HtmlSanitizer.escape(lead.company);
    const safeEmail = HtmlSanitizer.escape(lead.email.value);
    const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    await Promise.all([
      resend.emails.send({
        from: 'Gateway Yesode <leads@yesode.com>',
        to: ['filipe@yesode.com', 'davi@yesode.com'],
        subject: `[YESODE B2B] Novo Lead High-Ticket: ${safeCompany}`,
        html: `
          <div style="font-family: monospace; font-size: 14px; max-width: 600px;">
            <strong style="color: #C4A962;">[ Novo Lead Detectado ]</strong><br/><br/>
            Nome:&emsp;&emsp;${safeName}<br/>
            E-mail:&emsp;${safeEmail}<br/>
            Empresa:&emsp;${safeCompany}<br/>
            Time:&emsp;&emsp;${timestamp}<br/><br/>
            <em>Via API Gateway Protegido</em>
          </div>
        `
      }),
      resend.emails.send({
        from: 'Yesode Engineering <hello@yesode.com>',
        to: lead.email.value,
        subject: 'Mapeando sua arquitetura corporativa',
        text: `Olá ${lead.name},\n\nRecebemos sua solicitação de consultoria estratégica para a ${lead.company}.\n\nUm de nossos engenheiros fundadores está analisando seu contexto atual. Em breve, entraremos em contato direto para propormos a arquitetura do seu próximo passo.\n\nAtenciosamente,\n\nEquipe Yesode\nyesode.com`
      })
    ]);

    return res.status(200).json({ success: true, message: 'Lead routing completed.' });
  } catch (error: any) {
    if (error instanceof RateLimitExceededError) {
      res.setHeader('Retry-After', error.retryAfterSeconds);
      return res.status(429).json({ success: false, message: error.message, retryAfter: error.retryAfterSeconds });
    }
    if (error instanceof SecurityError) {
      // Bloqueio silencioso de bots
      return res.status(403).json({ success: false, message: error.message });
    }
    console.error('API /leads Gateway Exception:', error.message);
    return res.status(500).json({ success: false, message: 'Serviço temporariamente indisponível.' });
  }
}

