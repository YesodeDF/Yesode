import type { VercelRequest, VercelResponse } from '@vercel/node';

type DownloadFormat = 'video_muxed' | 'audio_only' | 'video_only' | 'gif';
type DownloadProfile = 'compatibility' | 'whatsapp_4k' | 'studio_max';

// Rate Limiter in-memory para Serverless
const ipBuckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, limit = 25, windowSeconds = 60): void {
  const now = Date.now();
  const entry = ipBuckets.get(ip);
  if (!entry || now > entry.resetAt) {
    ipBuckets.set(ip, { count: 1, resetAt: now + windowSeconds * 1000 });
    return;
  }
  entry.count += 1;
  if (entry.count > limit) {
    const err: any = new Error('Muitas requisições. Aguarde um instante e tente novamente.');
    err.status = 429;
    throw err;
  }
}

function validateAndNormalizeUrl(rawUrl: string): { url: string; platform: string } {
  const trimmed = rawUrl.trim();
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    const err: any = new Error('URL fornecida é inválida.');
    err.status = 400;
    throw err;
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    const err: any = new Error('Apenas links HTTP/HTTPS são permitidos.');
    err.status = 403;
    throw err;
  }

  const host = parsed.hostname.toLowerCase();
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.startsWith('10.') ||
    host.startsWith('192.168.') ||
    host.startsWith('169.254.') ||
    host.endsWith('.internal') ||
    host.endsWith('.local')
  ) {
    const err: any = new Error('Host local ou privado bloqueado por política anti-SSRF.');
    err.status = 403;
    throw err;
  }

  if (host.includes('youtube.com') || host.includes('youtu.be')) {
    return { url: parsed.toString(), platform: 'youtube' };
  }
  if (host === 'x.com' || host.endsWith('.x.com') || host.includes('twitter.com')) {
    return { url: parsed.toString(), platform: 'x' };
  }
  if (host.includes('instagram.com') || host.includes('ddinstagram.com')) {
    return { url: parsed.toString(), platform: 'instagram' };
  }
  if (host.includes('facebook.com') || host.includes('fb.watch') || host.includes('fb.com')) {
    return { url: parsed.toString(), platform: 'facebook' };
  }

  const err: any = new Error('Plataforma não suportada. Use links do YouTube, X/Twitter, Instagram ou Facebook.');
  err.status = 400;
  throw err;
}

function extractYouTubeId(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.split('/').filter(Boolean)[0] || null;
    }
    if (parsed.searchParams.has('v')) {
      return parsed.searchParams.get('v');
    }
    const parts = parsed.pathname.split('/').filter(Boolean);
    const idx = parts.findIndex((p) => p === 'shorts' || p === 'embed' || p === 'v' || p === 'live');
    if (idx !== -1 && parts[idx + 1]) {
      return parts[idx + 1];
    }
    const match = rawUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:[?&/]|$)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

function extractTweetId(rawUrl: string): string | null {
  const match = rawUrl.match(/(?:status|statuses)\/(\d+)/i);
  return match ? match[1] : null;
}

async function downloadYouTubeServerless(
  videoId: string,
  format: DownloadFormat
): Promise<{ buffer: Buffer; title: string; contentType: string; ext: string }> {
  let visitorData = '';
  try {
    const watchRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        Cookie: 'SOCS=CAI; PREF=hl=en&tz=UTC',
      },
    });
    if (watchRes.ok) {
      const html = await watchRes.text();
      const m =
        html.match(/"VISITOR_DATA"\s*:\s*"([^"]+)"/) ||
        html.match(/"visitorData"\s*:\s*"([^"]+)"/);
      if (m) visitorData = m[1];
    }
  } catch {
    // Segue sem visitorData caso falhe
  }

  const clients = [
    {
      id: '28',
      ctx: {
        clientName: 'ANDROID_VR',
        clientVersion: '1.65.10',
        deviceMake: 'Oculus',
        deviceModel: 'Quest 3',
        androidSdkVersion: 32,
        userAgent:
          'com.google.android.apps.youtube.vr.oculus/1.65.10 (Linux; U; Android 12L; eureka-user Build/SQ3A.220605.009.A1) gzip',
        osName: 'Android',
        osVersion: '12L',
      },
    },
    {
      id: '3',
      ctx: {
        clientName: 'ANDROID',
        clientVersion: '21.02.35',
        androidSdkVersion: 30,
        userAgent: 'com.google.android.youtube/21.02.35 (Linux; U; Android 11) gzip',
        osName: 'Android',
        osVersion: '11',
      },
    },
  ];

  for (const client of clients) {
    try {
      const playerRes = await fetch(
        'https://www.youtube.com/youtubei/v1/player?prettyPrint=false',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': client.ctx.userAgent,
            'X-YouTube-Client-Name': client.id,
            'X-YouTube-Client-Version': client.ctx.clientVersion,
            Origin: 'https://www.youtube.com',
            ...(visitorData ? { 'X-Goog-Visitor-Id': visitorData } : {}),
          },
          body: JSON.stringify({
            videoId,
            contentCheckOk: true,
            racyCheckOk: true,
            context: {
              client: {
                ...client.ctx,
                hl: 'en',
                timeZone: 'UTC',
                utcOffsetMinutes: 0,
                ...(visitorData ? { visitorData } : {}),
              },
            },
          }),
        }
      );

      if (!playerRes.ok) continue;
      const data = await playerRes.json();
      const title = data?.videoDetails?.title || `youtube-${videoId}`;
      const muxedFormats: any[] = data?.streamingData?.formats || [];
      const adaptiveFormats: any[] = data?.streamingData?.adaptiveFormats || [];

      if (muxedFormats.length === 0 && adaptiveFormats.length === 0) {
        continue;
      }

      let targetStream: any = null;
      let useRangeParam = false;
      let contentType = 'video/mp4';
      let ext = 'mp4';

      if (format === 'audio_only') {
        targetStream =
          adaptiveFormats.find(
            (f) => f.itag === 140 || (f.mimeType && f.mimeType.includes('audio/mp4'))
          ) || adaptiveFormats.find((f) => f.mimeType && f.mimeType.includes('audio/'));
        useRangeParam = !!targetStream?.contentLength;
        contentType = 'audio/mp4';
        ext = 'm4a';
      } else if (format === 'video_only') {
        const avc = adaptiveFormats
          .filter((f) => f.mimeType && f.mimeType.includes('video/mp4') && f.mimeType.includes('avc1'))
          .sort((a, b) => (b.height || 0) - (a.height || 0));
        targetStream = avc[0] || muxedFormats.find((f) => f.itag === 18) || muxedFormats[0];
        useRangeParam = !!targetStream?.contentLength;
      } else {
        targetStream =
          muxedFormats.find((f) => f.itag === 18) ||
          muxedFormats.find((f) => f.mimeType && f.mimeType.includes('video/mp4')) ||
          muxedFormats[0];
        useRangeParam = false;
      }

      if (!targetStream?.url) continue;

      const downloadUrl =
        useRangeParam && targetStream.contentLength
          ? `${targetStream.url}&range=0-${targetStream.contentLength}`
          : targetStream.url;

      const streamRes = await fetch(downloadUrl, {
        headers: { 'User-Agent': client.ctx.userAgent },
      });

      if (streamRes.ok) {
        const buffer = Buffer.from(await streamRes.arrayBuffer());
        if (buffer.length > 500) {
          return { buffer, title, contentType, ext };
        }
      }
    } catch {
      continue;
    }
  }

  // Fallback Piped / Invidious APIs públicas caso o IP da Vercel tome bloqueio do Innertube
  const pipedInstances = [
    'https://pipedapi.kavin.rocks',
    'https://pipedapi.tokhmi.xyz',
    'https://pipedapi.moomoo.me',
  ];
  for (const instance of pipedInstances) {
    try {
      const pRes = await fetch(`${instance}/streams/${videoId}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; YesodeMediaEngine/1.0)' },
      });
      if (!pRes.ok) continue;
      const pData = await pRes.json();
      const streams: any[] =
        format === 'audio_only' ? pData?.audioStreams || [] : pData?.videoStreams || [];
      const chosen =
        streams.find((s) => !s.videoOnly && s.format === 'MPEG_4') || streams[0];
      if (chosen?.url) {
        const sRes = await fetch(chosen.url);
        if (sRes.ok) {
          const buffer = Buffer.from(await sRes.arrayBuffer());
          if (buffer.length > 500) {
            return {
              buffer,
              title: pData?.title || `youtube-${videoId}`,
              contentType: format === 'audio_only' ? 'audio/mp4' : 'video/mp4',
              ext: format === 'audio_only' ? 'm4a' : 'mp4',
            };
          }
        }
      }
    } catch {
      continue;
    }
  }

  throw new Error('Não foi possível extrair o stream do YouTube no momento.');
}

async function downloadTwitterServerless(
  tweetId: string
): Promise<{ buffer: Buffer; title: string; contentType: string; ext: string }> {
  let videoUrl = '';
  let title = `x-video-${tweetId}`;

  // 1. FxTwitter API
  try {
    const fxRes = await fetch(`https://api.fxtwitter.com/status/${tweetId}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; YesodeMediaEngine/1.0)' },
    });
    if (fxRes.ok) {
      const fxData = await fxRes.json();
      const tweet = fxData?.tweet;
      const video =
        tweet?.media?.videos?.[0] ||
        tweet?.media?.all?.find((m: any) => m.type === 'video' || m.type === 'gif');
      if (video?.url) {
        videoUrl = video.url;
        if (tweet?.text) title = tweet.text.slice(0, 60).trim();
      }
    }
  } catch {
    // Tenta Syndication
  }

  // 2. Syndication API fallback
  if (!videoUrl) {
    const token = ((Number(tweetId) / 1e15) * Math.PI)
      .toString(36)
      .replace(/(0+|\.)/g, '');
    const synRes = await fetch(
      `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&token=${token}`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        },
      }
    );
    if (synRes.ok) {
      const synData = await synRes.json();
      const variants: Array<{ content_type: string; bitrate?: number; url: string }> =
        synData?.mediaDetails?.[0]?.video_info?.variants || [];
      const mp4s = variants
        .filter((v) => v.content_type === 'video/mp4' && v.url)
        .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
      if (mp4s.length > 0) {
        videoUrl = mp4s[0].url;
        if (synData?.text) title = synData.text.slice(0, 60).trim();
      }
    }
  }

  if (!videoUrl) {
    throw new Error('Não foi encontrado vídeo público neste link do X/Twitter.');
  }

  const streamRes = await fetch(videoUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    },
  });

  if (!streamRes.ok) {
    throw new Error(`Falha ao baixar mídia do X/Twitter (HTTP ${streamRes.status}).`);
  }

  const buffer = Buffer.from(await streamRes.arrayBuffer());
  if (buffer.length < 500) {
    throw new Error('O vídeo retornado pelo X/Twitter está vazio ou inacessível.');
  }

  return {
    buffer,
    title,
    contentType: 'video/mp4',
    ext: 'mp4',
  };
}

async function downloadGenericSocialServerless(
  targetUrl: string
): Promise<{ buffer: Buffer; title: string; contentType: string; ext: string }> {
  const normalizedUrl = targetUrl.replace(
    /^(https?:\/\/)(?:www\.)?instagram\.com/i,
    '$1ddinstagram.com'
  );
  const res = await fetch(normalizedUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)',
    },
  });
  if (!res.ok) {
    throw new Error(`Não foi possível acessar a publicação social (HTTP ${res.status}).`);
  }
  const html = await res.text();
  const videoMatch =
    html.match(/<meta\s+property=["']og:video(?::secure_url)?["']\s+content=["']([^"']+)["']/i) ||
    html.match(/content=["']([^"']+)["']\s+property=["']og:video(?::secure_url)?["']/i);
  const titleMatch =
    html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
    html.match(/<title>([^<]+)<\/title>/i);

  if (!videoMatch?.[1]) {
    throw new Error('Não foi possível extrair o link direto do vídeo desta publicação.');
  }

  const streamUrl = videoMatch[1].replace(/&amp;/g, '&');
  const streamRes = await fetch(streamUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    },
  });
  if (!streamRes.ok) {
    throw new Error(`Erro ao transferir arquivo de mídia (HTTP ${streamRes.status}).`);
  }

  const buffer = Buffer.from(await streamRes.arrayBuffer());
  return {
    buffer,
    title: titleMatch?.[1]?.trim() || 'social-video',
    contentType: 'video/mp4',
    ext: 'mp4',
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  try {
    checkRateLimit(clientIp, 25, 60);

    const targetUrl = (req.query.url as string) || (req.body?.url as string);
    const rawFormat = ((req.query.format as string) ||
      (req.body?.format as string) ||
      'video_muxed') as string;
    const format: DownloadFormat =
      rawFormat === 'audio'
        ? 'audio_only'
        : rawFormat === 'gif'
          ? 'gif'
          : rawFormat === 'video'
            ? 'video_muxed'
            : (rawFormat as DownloadFormat);
    const profile = (((req.query.profile as string) ||
      (req.body?.profile as string) ||
      'compatibility') as DownloadProfile);

    if (!targetUrl) {
      return res.status(400).json({ error: 'Parâmetro url é obrigatório.' });
    }

    const mediaSource = validateAndNormalizeUrl(targetUrl);

    // 1. Extrator Serverless 100% Node.js nativo (funciona na Vercel sem Python/FFmpeg)
    let result: { buffer: Buffer; title: string; contentType: string; ext: string };

    if (mediaSource.platform === 'youtube') {
      const ytId = extractYouTubeId(mediaSource.url);
      if (!ytId) {
        return res.status(400).json({ error: 'ID do vídeo do YouTube não identificado na URL.' });
      }
      result = await downloadYouTubeServerless(ytId, format);
    } else if (mediaSource.platform === 'x') {
      const tweetId = extractTweetId(mediaSource.url);
      if (!tweetId) {
        return res.status(400).json({ error: 'ID do post do X/Twitter não identificado na URL.' });
      }
      result = await downloadTwitterServerless(tweetId);
    } else {
      result = await downloadGenericSocialServerless(mediaSource.url);
    }

    const safeTitle = (result.title || `yesode-${mediaSource.platform}`)
      .replace(/[^a-zA-Z0-9_\-]/g, '_')
      .substring(0, 50);
    const finalFilename = `${safeTitle}.${result.ext}`;

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(finalFilename)}"; filename*=UTF-8''${encodeURIComponent(finalFilename)}`
    );
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Length', result.buffer.length.toString());
    res.setHeader('X-Media-Profile', profile);
    res.setHeader('X-Media-Video-Codec', 'avc1');
    res.setHeader('X-Media-Audio-Codec', 'mp4a');

    return res.status(200).send(result.buffer);
  } catch (error: any) {
    const status = error?.status || 500;
    return res.status(status).json({
      error: error?.message || 'Falha ao extrair mídia do link informado.',
    });
  }
}
