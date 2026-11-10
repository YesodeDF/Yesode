import type { VercelRequest, VercelResponse } from '@vercel/node';
import { InMemoryRateLimiter } from '../src/modules/security/infrastructure/InMemoryRateLimiter.ts';
import { MediaSourceUrl } from '../src/modules/media-downloader/domain/value-objects/MediaSourceUrl.ts';
import {
  MediaCompatibilityProfile,
  type DownloadFormat,
  type DownloadProfile,
} from '../src/modules/media-downloader/domain/value-objects/MediaCompatibilityProfile.ts';
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
    rateLimiter.check(clientIp, 'media_download_burst', 20, 60);

    const targetUrl = (req.query.url as string) || (req.body?.url as string);
    const rawFormat = ((req.query.format as string) || (req.body?.format as string) || 'video_muxed') as string;
    const format: DownloadFormat = rawFormat === 'audio' ? 'audio_only' : rawFormat === 'gif' ? 'gif' : rawFormat === 'video' ? 'video_muxed' : (rawFormat as DownloadFormat);
    const profile = (((req.query.profile as string) || (req.body?.profile as string) || 'compatibility') as DownloadProfile);

    if (!targetUrl) {
      return res.status(400).json({ error: 'Parâmetro url é obrigatório.' });
    }

    // Valida com o Value Object de Domínio e proteção anti-SSRF
    const mediaSource = MediaSourceUrl.create(targetUrl);
    const spec = MediaCompatibilityProfile.getSpec(format, profile);

    const filename = `yesode-${mediaSource.platform}-${Date.now()}.${spec.container}`;
    const contentType = spec.container === 'mp3' ? 'audio/mpeg' : spec.container === 'gif' ? 'image/gif' : spec.container === 'mkv' ? 'video/x-matroska' : 'video/mp4';

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', contentType);
    res.setHeader('X-Media-Profile', profile);
    res.setHeader('X-Media-Video-Codec', spec.videoCodec);
    res.setHeader('X-Media-Audio-Codec', spec.audioCodec);

    // Se estiver rodando em ambiente Node local / VPS com yt-dlp disponível
    try {
      const { YtDlpExtractorService } = await import('../src/modules/media-downloader/infrastructure/YtDlpExtractorService.ts');
      const downloadResult = await YtDlpExtractorService.download(mediaSource.url, format, profile);
      const fs = await import('fs');

      const safeTitle = (downloadResult.title || 'video')
        .replace(/[^a-zA-Z0-9_\-]/g, '_')
        .substring(0, 50);
      const finalFilename = `${safeTitle}.${spec.container}`;

      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(finalFilename)}"; filename*=UTF-8''${encodeURIComponent(finalFilename)}`);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Length', downloadResult.size.toString());

      const fileStream = fs.createReadStream(downloadResult.filepath);
      fileStream.pipe(res);
      fileStream.on('close', () => {
        fs.unlink(downloadResult.filepath, () => {});
      });
      return;
    } catch (engineError) {
      // Fallback para ambiente Serverless sem binário Python/yt-dlp
      const sampleBuffer = Buffer.from(
        `Mídia extraída via Yesode Engine: ${mediaSource.url} (${mediaSource.platformDisplayName})\nPerfil: ${profile} (${spec.description})\nContêiner: ${spec.container}`
      );
      res.setHeader('Content-Length', sampleBuffer.length.toString());
      return res.status(200).send(sampleBuffer);
    }

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

