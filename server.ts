import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Resend instance
const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

// Estrito de validação
const leadSchema = z.object({
  name: z.string().min(3),
  email: z.string().email().refine((email) => {
    const blockedDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];
    const domain = email.split('@')[1];
    return !blockedDomains.includes(domain);
  }, "Por favor, utilize seu e-mail corporativo"),
  company: z.string().min(2)
});

// Dual-Routing B2B Lead Gateway
app.post('/api/leads', async (req, res) => {
  try {
    const result = leadSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, errors: result.error.errors });
    }

    const { name, email, company } = result.data;
    const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    // Disparo Triplo assíncrono via Resend
    await Promise.all([
      // 1. Roteamento Interno (Diretoria)
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
      // 2. Auto-responder Premium (Lead/Cliente)
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
    // Silent fail para não expor a infraestrutura
    return res.status(500).json({ success: false, message: 'Serviço temporariamente indisponível.' });
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
