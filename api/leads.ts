import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

const leadSchema = z.object({
  name: z.string().min(3),
  email: z.string().email().refine((email) => {
    const blockedDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];
    const domain = email.split('@')[1];
    return !blockedDomains.includes(domain);
  }, "Por favor, utilize seu e-mail corporativo"),
  company: z.string().min(2)
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const result = leadSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, errors: result.error.errors });
    }

    const { name, email, company } = result.data;
    const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    await Promise.all([
      resend.emails.send({
        from: 'Gateway Yesode <leads@yesode.com.br>',
        to: ['filipe@yesode.com.br', 'davi@yesode.com.br'],
        subject: `[YESODE B2B] Novo Lead High-Ticket: ${company}`,
        html: `
          <div style="font-family: monospace; font-size: 14px; max-width: 600px;">
            <strong style="color: #C4A962;">[ Novo Lead Detectado ]</strong><br/><br/>
            Nome:&emsp;&emsp;${name}<br/>
            E-mail:&emsp;${email}<br/>
            Empresa:&emsp;${company}<br/>
            Time:&emsp;&emsp;${timestamp}<br/><br/>
            <em>Via API Gateway</em>
          </div>
        `
      }),
      resend.emails.send({
        from: 'Yesode Engineering <hello@yesode.com.br>',
        to: email,
        subject: 'Mapeando sua arquitetura corporativa',
        text: `Olá ${name},\n\nRecebemos sua solicitação de consultoria estratégica para a ${company}.\n\nUm de nossos engenheiros fundadores está analisando seu contexto atual. Em breve, entraremos em contato direto para propormos a arquitetura do seu próximo passo.\n\nAtenciosamente,\n\nEquipe Yesode\nyesode.com.br`
      })
    ]);

    return res.status(200).json({ success: true, message: 'Lead routing completed.' });
  } catch (error: any) {
    console.error('API /leads Gateway Exception:', error.message);
    return res.status(500).json({ success: false, message: 'Serviço temporariamente indisponível.' });
  }
}
