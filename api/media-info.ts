import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MediaSourceUrl } from '../src/modules/media-downloader/domain/value-objects/MediaSourceUrl.ts';
import {
  MediaDomainError,
  MediaSecurityError,
} from '../src/modules/media-downloader/domain/exceptions/MediaErrors.ts';
import { ServerlessMediaExtractor } from '../src/modules/media-downloader/infrastructure/ServerlessMediaExtractor.ts';

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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const targetUrl = (req.query.url as string) || '';
  if (!targetUrl) {
    return res.status(400).json({ error: 'Parâmetro url é obrigatório.' });
  }

  try {
    const mediaSource = MediaSourceUrl.create(targetUrl);
    const info = await ServerlessMediaExtractor.getInfo(mediaSource.url);
    return res.status(200).json(info);
  } catch (error: any) {
    if (error instanceof MediaSecurityError) {
      return res.status(403).json({ error: error.message });
    }
    if (error instanceof MediaDomainError) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(200).json({
      title: '',
      duration: 0,
      thumbnail: '',
      uploader: '',
    });
  }
}
