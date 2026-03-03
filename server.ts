import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Configurações para lidar com caminhos de arquivo no modo ES Module ("type": "module")
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rota de API
app.post('/api/send-invite', async (req, res) => {
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
      res.status(200).json({ success: true, message: 'Email sent successfully' });
    });
  } catch (error: any) {
    console.error('Express Error sending email:', error);
    res.status(500).json({ error: error.message || 'Failed to send email' });
  }
});

// Em Produção, sirva os arquivos estáticos do front-end compilado pelo Vite (pasta dist/)
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback para SPA (Single Page Application): Qualquer rota não encontrada na API vai retornar o index.html da pasta dist
app.use((req, res, next) => {
    if (req.method === 'GET' && req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    } else {
        next();
    }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
