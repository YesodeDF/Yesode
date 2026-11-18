import type { VercelRequest, VercelResponse } from '@vercel/node';

const DEFAULT_BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const DISCORD_CRAWLER_UA = 'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)';
const INSTAGRAM_HOSTS = ['instagram.com', 'ddinstagram.com', 'vxinstagram.com', 'kkinstagram.com'];

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

function isBlockedHost(host: string): boolean {
  const h = host.toLowerCase();
  return (
    h === 'localhost' ||
    h === '127.0.0.1' ||
    h.startsWith('10.') ||
    h.startsWith('192.168.') ||
    h.startsWith('172.16.') ||
    h.startsWith('169.254.') ||
    h.endsWith('.internal') ||
    h.endsWith('.local')
  );
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

async function fetchInstagramInfo(target: { kind: 'reel' | 'p' | 'tv'; shortcode: string }) {
  const fallbackTitle = `instagram-${target.kind}-${target.shortcode}`;
  const mirrors = [
    `https://vxinstagram.com/${target.kind}/${target.shortcode}/`,
    `https://kkinstagram.com/${target.kind}/${target.shortcode}/`,
    `https://ddinstagram.com/${target.kind}/${target.shortcode}/`,
  ];

  for (const mirrorUrl of mirrors) {
    try {
      const res = await fetch(mirrorUrl, {
        headers: { 'User-Agent': DISCORD_CRAWLER_UA },
        redirect: 'follow',
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) {
        await res.body?.cancel().catch(() => {});
        continue;
      }
      const ct = (res.headers.get('content-type') || '').toLowerCase();
      if (ct.startsWith('video/') || ct.includes('application/octet-stream')) {
        await res.body?.cancel().catch(() => {});
        return {
          title: fallbackTitle,
          duration: 0,
          thumbnail: '',
          uploader: 'Instagram',
        };
      }
      const html = await res.text();
      const ogTitle =
        extractMetaTag(html, 'og:title') ||
        extractMetaTag(html, 'twitter:title') ||
        decodeHtmlEntities(html.match(/<title>([^<]+)<\/title>/i)?.[1] || '');
      const ogDesc = extractMetaTag(html, 'og:description');
      const ogImage = extractMetaTag(html, 'og:image');
      if (ogTitle || ogDesc || extractMetaTag(html, 'og:video') || extractMetaTag(html, 'og:video:secure_url')) {
        return {
          title: ogTitle || (ogDesc ? ogDesc.slice(0, 70) : '') || fallbackTitle,
          duration: 0,
          thumbnail: ogImage || '',
          uploader: ogTitle || 'Instagram',
        };
      }
    } catch {
      continue;
    }
  }

  return {
    title: fallbackTitle,
    duration: 0,
    thumbnail: '',
    uploader: 'Instagram',
  };
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
    const parsed = new URL(targetUrl.trim());
    if ((parsed.protocol !== 'https:' && parsed.protocol !== 'http:') || isBlockedHost(parsed.hostname)) {
      return res.status(403).json({ error: 'URL não permitida.' });
    }

    const ytId = extractYouTubeId(parsed.toString());
    if (ytId) {
      const oembedRes = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${ytId}`)}&format=json`,
        { headers: { 'User-Agent': DEFAULT_BROWSER_UA }, signal: AbortSignal.timeout(8000) }
      );
      if (oembedRes.ok) {
        const oembed = await oembedRes.json();
        return res.status(200).json({
          title: oembed.title || `youtube-${ytId}`,
          duration: 0,
          thumbnail: oembed.thumbnail_url || `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
          uploader: oembed.author_name || 'YouTube',
        });
      }
    }

    const tweetId = extractTweetId(parsed.toString());
    if (tweetId) {
      const fxRes = await fetch(`https://api.fxtwitter.com/status/${tweetId}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; YesodeMediaEngine/1.0)' },
        signal: AbortSignal.timeout(10000),
      });
      if (fxRes.ok) {
        const fxData = await fxRes.json();
        const tweet = fxData?.tweet;
        const video = tweet?.media?.videos?.[0] || tweet?.media?.all?.[0];
        return res.status(200).json({
          title: (tweet?.text ? tweet.text.slice(0, 65).trim() : '') || `x-video-${tweetId}`,
          duration: Math.round(video?.duration || 0),
          thumbnail: video?.thumbnail_url || '',
          uploader: tweet?.author?.name || 'X',
        });
      }
    }

    const igTarget = extractInstagramTarget(parsed.toString());
    if (igTarget) {
      const igInfo = await fetchInstagramInfo(igTarget);
      return res.status(200).json(igInfo);
    }

    return res.status(200).json({
      title: '',
      duration: 0,
      thumbnail: '',
      uploader: '',
    });
  } catch {
    return res.status(200).json({
      title: '',
      duration: 0,
      thumbnail: '',
      uploader: '',
    });
  }
}
