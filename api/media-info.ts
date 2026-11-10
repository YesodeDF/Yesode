import type { VercelRequest, VercelResponse } from '@vercel/node';

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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const targetUrl = (req.query.url as string) || '';
  if (!targetUrl) {
    return res.status(400).json({ error: 'Parâmetro url é obrigatório.' });
  }

  try {
    const ytId = extractYouTubeId(targetUrl);
    if (ytId) {
      // Tenta oEmbed rápido do YouTube + Innertube ANDROID_VR para duração
      const oembedRes = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${ytId}`)}&format=json`
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

    const tweetId = extractTweetId(targetUrl);
    if (tweetId) {
      const fxRes = await fetch(`https://api.fxtwitter.com/status/${tweetId}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; YesodeMediaEngine/1.0)' },
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

    return res.status(200).json({
      title: '',
      duration: 0,
      thumbnail: '',
      uploader: '',
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Erro ao buscar metadados.' });
  }
}

