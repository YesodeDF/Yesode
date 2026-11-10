import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Lead } from './src/modules/leads/domain/entities/Lead.ts';
import { DomainError } from './src/modules/leads/domain/exceptions/LeadErrors.ts';
import { InMemoryRateLimiter } from './src/modules/security/infrastructure/InMemoryRateLimiter.ts';
import { BotTrapValidator } from './src/modules/security/domain/services/BotTrapValidator.ts';
import { HtmlSanitizer } from './src/modules/security/infrastructure/HtmlSanitizer.ts';
import { AdminAuthGuard } from './src/modules/security/infrastructure/AdminAuthGuard.ts';
import { SecurityError, RateLimitExceededError, UnauthorizedError } from './src/modules/security/domain/exceptions/SecurityErrors.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;
const rateLimiter = InMemoryRateLimiter.getInstance();

app.use(cors({
  origin: ['https://yesode.com', 'https://yesode.com.br', 'http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Resend instance
const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

// Endpoint /api/leads com validação via Domínio Rico + Anti-Bot + Rate Limiting
app.post('/api/leads', async (req, res) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '127.0.0.1';

  try {
    // 1. Rate Limiting por IP
    rateLimiter.check(clientIp, 'leads_submit_burst', 3, 60);
    rateLimiter.check(clientIp, 'leads_submit_hourly', 10, 3600);

    // 2. Anti-Bot Honeypot + Time-Trap
    const honeypot = req.body?.website_url || req.body?.honeypot;
    const clientTimestamp = parseInt(req.headers['x-client-timestamp'] as string || '0', 10);
    const submitTimeDeltaMs = clientTimestamp > 0 ? (Date.now() - clientTimestamp) : undefined;
    BotTrapValidator.validate({ honeypot, submitTimeDeltaMs });

    let lead: Lead;
    try {
      lead = Lead.create(req.body);
    } catch (err: any) {
      if (err instanceof DomainError) {
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(400).json({ success: false, message: 'Dados de lead inválidos.' });
    }

    const safeName = HtmlSanitizer.escape(lead.name);
    const safeCompany = HtmlSanitizer.escape(lead.company);
    const safeEmail = HtmlSanitizer.escape(lead.email.value);
    const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    await Promise.all([
      resend.emails.send({
        from: 'Gateway Yesode <leads@yesode.com.br>',
        to: ['filipe@yesode.com.br', 'davi@yesode.com.br'],
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
        from: 'Yesode Engineering <hello@yesode.com.br>',
        to: lead.email.value,
        subject: 'Mapeando sua arquitetura corporativa',
        text: `Olá ${lead.name},\n\nRecebemos sua solicitação de consultoria estratégica para a ${lead.company}.\n\nUm de nossos engenheiros fundadores está analisando seu contexto atual. Em breve, entraremos em contato direto para propormos a arquitetura do seu próximo passo.\n\nAtenciosamente,\n\nEquipe Yesode\nyesode.com.br`
      })
    ]);

    return res.status(200).json({ success: true, message: 'Lead routing completed.' });

  } catch (error: any) {
    if (error instanceof RateLimitExceededError) {
      res.setHeader('Retry-After', error.retryAfterSeconds);
      return res.status(429).json({ success: false, message: error.message, retryAfter: error.retryAfterSeconds });
    }
    if (error instanceof SecurityError) {
      return res.status(403).json({ success: false, message: error.message });
    }
    console.error('API /leads Gateway Exception:', error.message);
    return res.status(500).json({ success: false, message: 'Serviço temporariamente indisponível.' });
  }
});

// Endpoint /api/send-invite com autenticação administrativa e rate limiting
app.post('/api/send-invite', async (req, res) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '127.0.0.1';

  try {
    AdminAuthGuard.verifyAdminToken(req.headers.authorization);
    rateLimiter.check(clientIp, 'invite_send_burst', 5, 60);

    const { to, cc, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes: to, subject, html.' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      logger: false,
      debug: false
    });

    const mailOptions = {
      from: `"Yesod" <${process.env.GMAIL_USER}>`,
      to,
      cc,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Email enviado com sucesso.' });
  } catch (error: any) {
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ error: error.message });
    }
    if (error instanceof RateLimitExceededError) {
      res.setHeader('Retry-After', error.retryAfterSeconds);
      return res.status(429).json({ error: error.message });
    }
    if (error instanceof SecurityError) {
      return res.status(403).json({ error: error.message });
    }
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Falha no envio de e-mail.' });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));
app.use((req, res, next) => {
    if (req.method === 'GET' && req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    } else {
        next();
    }
});

app.listen(port, () => {
  console.log(`Gateway & UI running at http://localhost:${port}`);
});
