import type { VercelRequest, VercelResponse } from '@vercel/node';

type DownloadFormat = 'video_muxed' | 'audio_only' | 'video_only' | 'gif';
type DownloadProfile = 'compatibility' | 'whatsapp_4k' | 'studio_max';

interface ResolvedStream {
  streamUrl: string;
  title: string;
  contentType: string;
  extension: string;
  contentLength?: number;
  requestHeaders: Record<string, string>;
  browserDirectSafe: boolean;
}

const VERCEL_SAFE_PROXY_BYTES = 4 * 1024 * 1024;
const DEFAULT_BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const DISCORD_CRAWLER_UA = 'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)';
const INSTAGRAM_HOSTS = ['instagram.com', 'ddinstagram.com', 'vxinstagram.com', 'kkinstagram.com'];
const REQUEST_TIMEOUT_MS = 12000;

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
    host.startsWith('172.16.') ||
    host.startsWith('169.254.') ||
    host.endsWith('.internal') ||
    host.endsWith('.local')
  ) {
    const err: any = new Error('Host local ou privado bloqueado por política anti-SSRF.');
    err.status = 403;
    throw err;
  }

  if (host === 'youtu.be' || host.endsWith('.youtu.be') || host === 'youtube.com' || host.endsWith('.youtube.com')) {
    return { url: parsed.toString(), platform: 'youtube' };
  }
  if (host === 'x.com' || host.endsWith('.x.com') || host === 'twitter.com' || host.endsWith('.twitter.com')) {
    return { url: parsed.toString(), platform: 'x' };
  }
  if (INSTAGRAM_HOSTS.some((d) => host === d || host.endsWith(`.${d}`))) {
    return { url: parsed.toString(), platform: 'instagram' };
  }
  if (
    host === 'facebook.com' ||
    host.endsWith('.facebook.com') ||
    host === 'fb.watch' ||
    host.endsWith('.fb.watch') ||
    host === 'fb.com' ||
    host.endsWith('.fb.com')
  ) {
    return { url: parsed.toString(), platform: 'facebook' };
  }

  const err: any = new Error('Plataforma não suportada. Use links do YouTube, X/Twitter, Instagram ou Facebook.');
  err.status = 400;
  throw err;
}

function extractYouTubeId(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl);
    const h = parsed.hostname.toLowerCase();
    if (!(h === 'youtu.be' || h.endsWith('.youtu.be') || h === 'youtube.com' || h.endsWith('.youtube.com'))) {
      return null;
    }
    if (h.includes('youtu.be')) {
      const id = parsed.pathname.split('/').filter(Boolean)[0] || null;
      return id && /^[0-9A-Za-z_-]{11}$/.test(id) ? id : null;
    }
    const vParam = parsed.searchParams.get('v');
    if (vParam && /^[0-9A-Za-z_-]{11}$/.test(vParam)) {
      return vParam;
    }
    const parts = parsed.pathname.split('/').filter(Boolean);
    const idx = parts.findIndex((p) => ['shorts', 'embed', 'v', 'live'].includes(p));
    if (idx !== -1 && parts[idx + 1] && /^[0-9A-Za-z_-]{11}$/.test(parts[idx + 1])) {
      return parts[idx + 1];
    }
    return null;
  } catch {
    return null;
  }
}

function extractTweetId(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl);
    const h = parsed.hostname.toLowerCase();
    if (!(h === 'x.com' || h.endsWith('.x.com') || h === 'twitter.com' || h.endsWith('.twitter.com'))) {
      return null;
    }
    const match = parsed.pathname.match(/(?:status|statuses)\/(\d+)/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

function extractInstagramTarget(rawUrl: string): { kind: 'reel' | 'p' | 'tv'; shortcode: string } | null {
  try {
    const parsed = new URL(rawUrl);
    const h = parsed.hostname.toLowerCase();
    if (!INSTAGRAM_HOSTS.some((d) => h === d || h.endsWith(`.${d}`))) {
      return null;
    }
    const match = parsed.pathname.match(/(?:^|\/)(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i);
    if (!match) return null;
    const rawKind = match[1].toLowerCase();
    const kind = rawKind === 'p' ? 'p' : rawKind === 'tv' ? 'tv' : 'reel';
    return { kind, shortcode: match[2] };
  } catch {
    return null;
  }
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function extractMetaTag(html: string, propertyName: string): string {
  const escaped = propertyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patternA = new RegExp(
    `<meta\\s+[^>]*(?:property|name)=["']${escaped}["'][^>]*content=["']([^"']+)["']`,
    'i'
  );
  const patternB = new RegExp(
    `<meta\\s+[^>]*content=["']([^"']+)["'][^>]*(?:property|name)=["']${escaped}["']`,
    'i'
  );
  const match = html.match(patternA) || html.match(patternB);
  return match?.[1] ? decodeHtmlEntities(match[1]) : '';
}

async function probeStreamHeaders(
  streamUrl: string,
  headers: Record<string, string>
): Promise<{ contentLength?: number; contentType?: string; finalUrl?: string }> {
  try {
    const headRes = await fetch(streamUrl, {
      method: 'HEAD',
      headers,
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    });
    if (headRes.ok) {
      const rawLen = headRes.headers.get('content-length');
      const parsedLen = rawLen ? Number(rawLen) : NaN;
      return {
        contentLength: Number.isFinite(parsedLen) && parsedLen > 0 ? parsedLen : undefined,
        contentType: headRes.headers.get('content-type') || undefined,
        finalUrl: headRes.url || streamUrl,
      };
    }
  } catch {
    // Fallback para GET com Range mínimo quando HEAD não é aceito
  }

  try {
    const rangeRes = await fetch(streamUrl, {
      method: 'GET',
      headers: { ...headers, Range: 'bytes=0-0' },
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    });
    const contentRange = rangeRes.headers.get('content-range');
    const totalFromRange = contentRange?.match(/\/(\d+)$/)?.[1];
    const rawLen = totalFromRange || rangeRes.headers.get('content-length');
    const ct = rangeRes.headers.get('content-type') || undefined;
    const finalUrl = rangeRes.url || streamUrl;
    await rangeRes.body?.cancel().catch(() => {});

    const parsedLen = rawLen ? Number(rawLen) : NaN;
    return {
      contentLength: Number.isFinite(parsedLen) && parsedLen > 0 ? parsedLen : undefined,
      contentType: ct,
      finalUrl,
    };
  } catch {
    return {};
  }
}

async function resolveYouTubeStream(videoId: string, format: DownloadFormat): Promise<ResolvedStream> {
  let visitorData = '';
  try {
    const watchRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': DEFAULT_BROWSER_UA,
        Cookie: 'SOCS=CAI; PREF=hl=en&tz=UTC',
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (watchRes.ok) {
      const html = await watchRes.text();
      const m =
        html.match(/"VISITOR_DATA"\s*:\s*"([^"]+)"/) ||
        html.match(/"visitorData"\s*:\s*"([^"]+)"/);
      if (m) visitorData = m[1];
    }
  } catch {
    // Continua sem visitorData
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
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        }
      );

      if (!playerRes.ok) continue;
      const data = await playerRes.json();
      const title = data?.videoDetails?.title || `youtube-${videoId}`;
      const muxedFormats: any[] = data?.streamingData?.formats || [];
      const adaptiveFormats: any[] = data?.streamingData?.adaptiveFormats || [];

      if (muxedFormats.length === 0 && adaptiveFormats.length === 0) continue;

      let targetStream: any = null;
      let useRangeParam = false;
      let contentType = 'video/mp4';
      let extension = 'mp4';

      if (format === 'audio_only') {
        targetStream =
          adaptiveFormats.find(
            (f) => f.itag === 140 || (f.mimeType && f.mimeType.includes('audio/mp4'))
          ) || adaptiveFormats.find((f) => f.mimeType && f.mimeType.includes('audio/'));
        useRangeParam = !!targetStream?.contentLength;
        contentType = 'audio/mp4';
        extension = 'm4a';
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

      const streamUrl =
        useRangeParam && targetStream.contentLength
          ? `${targetStream.url}&range=0-${targetStream.contentLength}`
          : targetStream.url;
      const parsedLen = targetStream.contentLength ? Number(targetStream.contentLength) : undefined;

      return {
        streamUrl,
        title,
        contentType,
        extension,
        contentLength: Number.isFinite(parsedLen) && parsedLen! > 0 ? parsedLen : undefined,
        requestHeaders: { 'User-Agent': client.ctx.userAgent },
        browserDirectSafe: false,
      };
    } catch {
      continue;
    }
  }

  const pipedInstances = [
    'https://pipedapi.kavin.rocks',
    'https://pipedapi.tokhmi.xyz',
    'https://pipedapi.moomoo.me',
  ];
  for (const instance of pipedInstances) {
    try {
      const pRes = await fetch(`${instance}/streams/${videoId}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; YesodeMediaEngine/1.0)' },
        signal: AbortSignal.timeout(8000),
      });
      if (!pRes.ok) continue;
      const pData = await pRes.json();
      const streams: any[] =
        format === 'audio_only' ? pData?.audioStreams || [] : pData?.videoStreams || [];
      const chosen =
        streams.find((s) => !s.videoOnly && s.format === 'MPEG_4') || streams[0];
      if (chosen?.url) {
        return {
          streamUrl: chosen.url,
          title: pData?.title || `youtube-${videoId}`,
          contentType: format === 'audio_only' ? 'audio/mp4' : 'video/mp4',
          extension: format === 'audio_only' ? 'm4a' : 'mp4',
          contentLength: Number(chosen.contentLength || 0) || undefined,
          requestHeaders: { 'User-Agent': DEFAULT_BROWSER_UA },
          browserDirectSafe: false,
        };
      }
    } catch {
      continue;
    }
  }

  throw new Error('Não foi possível extrair o stream do YouTube no momento.');
}

async function resolveTwitterStream(tweetId: string): Promise<ResolvedStream> {
  let videoUrl = '';
  let title = `x-video-${tweetId}`;

  try {
    const fxRes = await fetch(`https://api.fxtwitter.com/status/${tweetId}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; YesodeMediaEngine/1.0)' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
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

  if (!videoUrl) {
    const token = ((Number(tweetId) / 1e15) * Math.PI)
      .toString(36)
      .replace(/(0+|\.)/g, '');
    const synRes = await fetch(
      `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&token=${token}`,
      {
        headers: { 'User-Agent': DEFAULT_BROWSER_UA },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
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

  const headers = { 'User-Agent': DEFAULT_BROWSER_UA };
  const probe = await probeStreamHeaders(videoUrl, headers);

  return {
    streamUrl: probe.finalUrl || videoUrl,
    title,
    contentType: 'video/mp4',
    extension: 'mp4',
    contentLength: probe.contentLength,
    requestHeaders: headers,
    browserDirectSafe: true,
  };
}

async function resolveSocialMirror(mirrorUrl: string, fallbackTitle: string): Promise<{
  videoUrl: string;
  title: string;
  contentLength?: number;
}> {
  const res = await fetch(mirrorUrl, {
    headers: { 'User-Agent': DISCORD_CRAWLER_UA },
    redirect: 'follow',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    await res.body?.cancel().catch(() => {});
    throw new Error(`HTTP ${res.status} em ${mirrorUrl}`);
  }

  const contentType = (res.headers.get('content-type') || '').toLowerCase();
  if (contentType.startsWith('video/') || contentType.includes('application/octet-stream')) {
    const rawLen = res.headers.get('content-length');
    const parsedLen = rawLen ? Number(rawLen) : NaN;
    const finalUrl = res.url || mirrorUrl;
    await res.body?.cancel().catch(() => {});
    return {
      videoUrl: finalUrl,
      title: fallbackTitle,
      contentLength: Number.isFinite(parsedLen) && parsedLen > 0 ? parsedLen : undefined,
    };
  }

  const html = await res.text();
  const rawVideoUrl =
    extractMetaTag(html, 'og:video:secure_url') ||
    extractMetaTag(html, 'og:video') ||
    extractMetaTag(html, 'twitter:player:stream');

  if (!rawVideoUrl) {
    throw new Error(`Stream og:video ausente em ${mirrorUrl}`);
  }

  const videoUrl = new URL(rawVideoUrl, res.url || mirrorUrl).toString();
  const ogTitle =
    extractMetaTag(html, 'og:title') ||
    extractMetaTag(html, 'twitter:title') ||
    decodeHtmlEntities(html.match(/<title>([^<]+)<\/title>/i)?.[1] || '');
  const ogDesc = extractMetaTag(html, 'og:description');

  return {
    videoUrl,
    title: ogTitle || (ogDesc ? ogDesc.slice(0, 70) : '') || fallbackTitle,
  };
}

async function resolveInstagramStream(targetUrl: string): Promise<ResolvedStream> {
  const target = extractInstagramTarget(targetUrl);
  if (!target) {
    throw new Error('Link do Instagram inválido. Informe um link de Reel, Post (/p/) ou IGTV.');
  }

  const fallbackTitle = `instagram-${target.kind}-${target.shortcode}`;
  const mirrors = [
    `https://vxinstagram.com/${target.kind}/${target.shortcode}/`,
    `https://kkinstagram.com/${target.kind}/${target.shortcode}/`,
    `https://ddinstagram.com/${target.kind}/${target.shortcode}/`,
  ];

  const errors: string[] = [];
  for (const mirror of mirrors) {
    try {
      const resolvedMirror = await resolveSocialMirror(mirror, fallbackTitle);
      const headers = { 'User-Agent': DEFAULT_BROWSER_UA };
      const probe = await probeStreamHeaders(resolvedMirror.videoUrl, headers);
      return {
        streamUrl: probe.finalUrl || resolvedMirror.videoUrl,
        title: resolvedMirror.title,
        contentType: 'video/mp4',
        extension: 'mp4',
        contentLength: resolvedMirror.contentLength || probe.contentLength,
        requestHeaders: headers,
        browserDirectSafe: true,
      };
    } catch (err: any) {
      errors.push(err?.message || mirror);
    }
  }

  throw new Error(
    `Não foi possível extrair o vídeo público deste link do Instagram (${errors[0] || 'sem resposta'}). Verifique se o perfil é público.`
  );
}

async function resolveGenericSocialStream(targetUrl: string): Promise<ResolvedStream> {
  const resolvedMirror = await resolveSocialMirror(targetUrl, 'social-video');
  const headers = { 'User-Agent': DEFAULT_BROWSER_UA };
  const probe = await probeStreamHeaders(resolvedMirror.videoUrl, headers);

  return {
    streamUrl: probe.finalUrl || resolvedMirror.videoUrl,
    title: resolvedMirror.title,
    contentType: 'video/mp4',
    extension: 'mp4',
    contentLength: resolvedMirror.contentLength || probe.contentLength,
    requestHeaders: headers,
    browserDirectSafe: true,
  };
}

async function fetchBufferWithLimit(
  resolved: ResolvedStream,
  maxBytes: number
): Promise<{ buffer?: Buffer; exceededLimit: boolean }> {
  if (resolved.contentLength && resolved.contentLength > maxBytes) {
    return { exceededLimit: true };
  }

  const connectController = new AbortController();
  const connectTimer = setTimeout(() => connectController.abort(), 15000);
  let streamRes: Response;
  try {
    streamRes = await fetch(resolved.streamUrl, {
      headers: resolved.requestHeaders,
      redirect: 'follow',
      signal: connectController.signal,
    });
  } finally {
    clearTimeout(connectTimer);
  }

  if (!streamRes.ok) {
    await streamRes.body?.cancel().catch(() => {});
    throw new Error(`Erro ao transferir arquivo de mídia (HTTP ${streamRes.status}).`);
  }

  const ct = (streamRes.headers.get('content-type') || '').toLowerCase();
  if (ct.includes('text/html')) {
    await streamRes.body?.cancel().catch(() => {});
    throw new Error('O provedor retornou uma página HTML em vez de fluxo de vídeo.');
  }

  const headerLen = Number(streamRes.headers.get('content-length') || 0);
  if (headerLen > maxBytes) {
    await streamRes.body?.cancel().catch(() => {});
    return { exceededLimit: true };
  }

  if (!streamRes.body) {
    const buffer = Buffer.from(await streamRes.arrayBuffer());
    if (buffer.length > maxBytes) return { exceededLimit: true };
    if (buffer.length < 500) throw new Error('Stream de mídia retornado está vazio ou incompleto.');
    return { buffer, exceededLimit: false };
  }

  const reader = streamRes.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel().catch(() => {});
        return { exceededLimit: true };
      }
      chunks.push(value);
    }
  }

  const buffer = Buffer.concat(chunks);
  if (buffer.length < 500) {
    throw new Error('Stream de mídia retornado está vazio ou incompleto.');
  }

  return { buffer, exceededLimit: false };
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
    checkRateLimit(clientIp, 25, 60);

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

    const mediaSource = validateAndNormalizeUrl(targetUrl);

    let resolved: ResolvedStream;
    if (mediaSource.platform === 'youtube') {
      const ytId = extractYouTubeId(mediaSource.url);
      if (!ytId) {
        return res.status(400).json({ error: 'ID do vídeo do YouTube não identificado na URL.' });
      }
      resolved = await resolveYouTubeStream(ytId, format);
    } else if (mediaSource.platform === 'x') {
      const tweetId = extractTweetId(mediaSource.url);
      if (!tweetId) {
        return res.status(400).json({ error: 'ID do post do X/Twitter não identificado na URL.' });
      }
      resolved = await resolveTwitterStream(tweetId);
    } else if (mediaSource.platform === 'instagram') {
      resolved = await resolveInstagramStream(mediaSource.url);
    } else {
      resolved = await resolveGenericSocialStream(mediaSource.url);
    }

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

    const { buffer, exceededLimit } = await fetchBufferWithLimit(resolved, VERCEL_SAFE_PROXY_BYTES);

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
          'Este arquivo excede o limite de transferência direta do servidor serverless (4.5 MB).',
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
    const status = error?.status || 500;
    return res.status(status).json({
      error: error?.message || 'Falha ao extrair mídia do link informado.',
    });
  }
}
