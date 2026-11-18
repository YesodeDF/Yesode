import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MediaSourceUrl } from '../src/modules/media-downloader/domain/value-objects/MediaSourceUrl.ts';
import {
  MediaDomainError,
  MediaSecurityError,
} from '../src/modules/media-downloader/domain/exceptions/MediaErrors.ts';
import type {
  DownloadFormat,
  DownloadProfile,
} from '../src/modules/media-downloader/domain/value-objects/MediaCompatibilityProfile.ts';
import { ServerlessMediaExtractor } from '../src/modules/media-downloader/infrastructure/ServerlessMediaExtractor.ts';
import { InMemoryRateLimiter } from '../src/modules/security/infrastructure/InMemoryRateLimiter.ts';
import { RateLimitExceededError } from '../src/modules/security/domain/exceptions/SecurityErrors.ts';

// Vercel Serverless Functions limit response payloads to 4.5 MB.
// Files larger than 4 MB are handed off directly via their CORS-enabled stream URL.
const VERCEL_SAFE_PROXY_BYTES = 4 * 1024 * 1024;
const rateLimiter = InMemoryRateLimiter.getInstance();

function setCorsHeaders(req: VercelRequest, res: VercelResponse): void {
  const origin = req.headers.origin || '';
  if (
    origin.includes('yesode.com') ||
    origin.includes('vercel.app') ||
    origin.includes('localhost')
  ) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

function normalizeFormat(rawFormat: string): DownloadFormat {
  if (rawFormat === 'audio') return 'audio_only';
  if (rawFormat === 'gif') return 'gif';
  if (rawFormat === 'video') return 'video_muxed';
  return rawFormat as DownloadFormat;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  try {
    rateLimiter.check(clientIp, 'media_download_burst', 25, 60);

    const targetUrl = (req.query.url as string) || (req.body?.url as string);
    const rawFormat = ((req.query.format as string) ||
      (req.body?.format as string) ||
      'video_muxed') as string;
    const format = normalizeFormat(rawFormat);
    const profile = (((req.query.profile as string) ||
      (req.body?.profile as string) ||
      'compatibility') as DownloadProfile);

    if (!targetUrl) {
      return res.status(400).json({ error: 'Parâmetro url é obrigatório.' });
    }

    const mediaSource = MediaSourceUrl.create(targetUrl);
    const resolved = await ServerlessMediaExtractor.resolveStream(
      mediaSource.url,
      format,
      profile
    );

    const safeTitle = (resolved.title || `yesode-${mediaSource.platform}`)
      .replace(/[^a-zA-Z0-9_\-]/g, '_')
      .substring(0, 50);
    const finalFilename = `${safeTitle}.${resolved.extension}`;

    if (
      resolved.browserDirectSafe &&
      resolved.contentLength &&
      resolved.contentLength > VERCEL_SAFE_PROXY_BYTES
    ) {
      return res.status(200).json({
        mode: 'direct_url',
        directUrl: resolved.streamUrl,
        filename: finalFilename,
        contentType: resolved.contentType,
        size: resolved.contentLength,
        platform: mediaSource.platform,
      });
    }

    const { buffer, exceededLimit } = await ServerlessMediaExtractor.fetchBufferWithLimit(
      resolved,
      VERCEL_SAFE_PROXY_BYTES
    );

    if (exceededLimit || !buffer) {
      if (resolved.browserDirectSafe) {
        return res.status(200).json({
          mode: 'direct_url',
          directUrl: resolved.streamUrl,
          filename: finalFilename,
          contentType: resolved.contentType,
          size: resolved.contentLength ?? null,
          platform: mediaSource.platform,
        });
      }

      return res.status(413).json({
        error:
          'Este arquivo excede o limite de transferência direta do servidor serverless (4.5 MB). Use o ambiente local com yt-dlp ou tente um formato mais compacto.',
      });
    }

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(finalFilename)}"; filename*=UTF-8''${encodeURIComponent(finalFilename)}`
    );
    res.setHeader('Content-Type', resolved.contentType);
    res.setHeader('Content-Length', buffer.length.toString());
    res.setHeader('X-Media-Profile', profile);
    res.setHeader('X-Media-Video-Codec', 'avc1');
    res.setHeader('X-Media-Audio-Codec', 'mp4a');

    return res.status(200).send(buffer);
  } catch (error: any) {
    if (error instanceof RateLimitExceededError) {
      res.setHeader('Retry-After', error.retryAfterSeconds);
      return res.status(429).json({ error: error.message });
    }
    if (error instanceof MediaSecurityError) {
      return res.status(403).json({ error: error.message });
    }
    if (error instanceof MediaDomainError) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({
      error: error?.message || 'Falha ao extrair mídia do link informado.',
    });
  }
}
