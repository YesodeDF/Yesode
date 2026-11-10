import type { VercelRequest, VercelResponse } from '@vercel/node';
import { InMemoryRateLimiter } from '../src/modules/security/infrastructure/InMemoryRateLimiter.ts';
import { MediaSourceUrl } from '../src/modules/media-downloader/domain/value-objects/MediaSourceUrl.ts';
import { SecurityError, RateLimitExceededError } from '../src/modules/security/domain/exceptions/SecurityErrors.ts';

const rateLimiter = InMemoryRateLimiter.getInstance();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || '';
  const allowedOrigins = ['https://yesode.com', 'https://yesode.com.br', 'http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'];
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://yesode.com');
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '127.0.0.1';

  try {
    rateLimiter.check(clientIp, 'media_download_burst', 15, 60);

    const targetUrl = (req.query.url as string) || (req.body?.url as string);
    const format = ((req.query.format as string) || (req.body?.format as string) || 'video') as 'video' | 'audio' | 'gif';

    if (!targetUrl) {
      return res.status(400).json({ error: 'Parâmetro url é obrigatório.' });
    }

    // Valida com o Value Object de Domínio e proteção anti-SSRF
    const mediaSource = MediaSourceUrl.create(targetUrl);

    // Gera o stream ou proxy de mídia
    const filename = `yesode-${mediaSource.platform}-${Date.now()}.${format === 'audio' ? 'mp3' : format === 'gif' ? 'gif' : 'mp4'}`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', format === 'audio' ? 'audio/mpeg' : format === 'gif' ? 'image/gif' : 'video/mp4');

    // Em ambiente serverless da Vercel, entregamos o buffer/stream da mídia
    // Para teste e simulação fiel com salvamento real no browser:
    const sampleBuffer = Buffer.from(
      `Mídia extraída via Yesode Engine: ${mediaSource.url} (${mediaSource.platformDisplayName}) - Formato: ${format}`
    );

    res.setHeader('Content-Length', sampleBuffer.length.toString());
    return res.status(200).send(sampleBuffer);

  } catch (error: any) {
    if (error instanceof RateLimitExceededError) {
      res.setHeader('Retry-After', error.retryAfterSeconds);
      return res.status(429).json({ error: error.message });
    }
    if (error instanceof SecurityError) {
      return res.status(403).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message || 'Falha na extração de mídia.' });
  }
}

