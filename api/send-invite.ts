import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { InMemoryRateLimiter } from '../src/modules/security/infrastructure/InMemoryRateLimiter.ts';
import { AdminAuthGuard } from '../src/modules/security/infrastructure/AdminAuthGuard.ts';
import { SecurityError, RateLimitExceededError, UnauthorizedError } from '../src/modules/security/domain/exceptions/SecurityErrors.ts';

dotenv.config();

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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
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
    // 1. Blindagem de Autenticação Administrativa (Impede que bots usem como Open Relay de SPAM)
    AdminAuthGuard.verifyAdminToken(req.headers.authorization);

    // 2. Rate Limiting por IP (Máximo 5 envios de convites por minuto)
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
      from: `"Yesode" <${process.env.GMAIL_USER}>`,
      to,
      cc,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Convite enviado com sucesso.' });
  } catch (error: any) {
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ success: false, error: error.message });
    }
    if (error instanceof RateLimitExceededError) {
      res.setHeader('Retry-After', error.retryAfterSeconds);
      return res.status(429).json({ success: false, error: error.message });
    }
    if (error instanceof SecurityError) {
      return res.status(403).json({ success: false, error: error.message });
    }
    console.error('Vercel Serverless Error sending email:', error.message || error);
    return res.status(500).json({ error: 'Falha no serviço de envio de convite.' });
  }
}

