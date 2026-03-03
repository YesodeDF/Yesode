import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Configuração CORS básica para Serverless Functions na Vercel
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Lidar com requisições de preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verificar se o método é POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { to, cc, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      logger: true,
      debug: true
    });

    const mailOptions = {
      from: `"Yesod" <${process.env.GMAIL_USER}>`,
      to,
      cc,
      subject,
      html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Nodemailer Error:', error);
        return res.status(500).json({ error: error.message });
      }
      console.log('Message sent: %s', info.messageId);
      return res.status(200).json({ success: true, message: 'Email sent successfully' });
    });
  } catch (error: any) {
    console.error('Vercel Serverless Error sending email:', error);
    return res.status(500).json({ error: error.message || 'Failed to send email' });
  }
}
