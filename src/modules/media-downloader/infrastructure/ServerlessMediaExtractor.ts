import type {
  DownloadFormat,
  DownloadProfile,
} from '../domain/value-objects/MediaCompatibilityProfile.ts';

export interface ServerlessMediaInfo {
  title: string;
  duration: number;
  thumbnail: string;
  uploader: string;
}

export interface ServerlessDownloadResult {
  buffer: Buffer;
  title: string;
  contentType: string;
  extension: string;
}

/**
 * Extrator 100% Node.js nativo (Zero Python / Zero Binários Externos)
 * Projetado especificamente para rodar no runtime Serverless da Vercel.
 */
export class ServerlessMediaExtractor {
  private static extractYouTubeId(rawUrl: string): string | null {
    try {
      const parsed = new URL(rawUrl);
      if (parsed.hostname.includes('youtu.be')) {
        return parsed.pathname.split('/').filter(Boolean)[0] || null;
      }
      if (parsed.searchParams.has('v')) {
        return parsed.searchParams.get('v');
      }
      const pathParts = parsed.pathname.split('/').filter(Boolean);
      const shortsIdx = pathParts.findIndex((p) => p === 'shorts' || p === 'embed' || p === 'v' || p === 'live');
      if (shortsIdx !== -1 && pathParts[shortsIdx + 1]) {
        return pathParts[shortsIdx + 1];
      }
      const match = rawUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:[?&/]|$)/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  private static extractTweetId(rawUrl: string): string | null {
    const match = rawUrl.match(/(?:status|statuses)\/(\d+)/i);
    return match ? match[1] : null;
  }

  private static async fetchYouTubePlayer(videoId: string): Promise<{
    playerData: any;
    userAgent: string;
  }> {
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
        const visitorMatch =
          html.match(/"VISITOR_DATA"\s*:\s*"([^"]+)"/) ||
          html.match(/"visitorData"\s*:\s*"([^"]+)"/);
        if (visitorMatch) {
          visitorData = visitorMatch[1];
        }
      }
    } catch {
      // Continua mesmo se a página watch falhar
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
          userAgent:
            'com.google.android.youtube/21.02.35 (Linux; U; Android 11) gzip',
          osName: 'Android',
          osVersion: '11',
        },
      },
    ];

    for (const client of clients) {
      try {
        const res = await fetch(
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

        if (!res.ok) continue;
        const data = await res.json();
        const hasStreams =
          (data?.streamingData?.formats?.length || 0) > 0 ||
          (data?.streamingData?.adaptiveFormats?.length || 0) > 0;

        if (hasStreams) {
          return { playerData: data, userAgent: client.ctx.userAgent };
        }
      } catch {
        continue;
      }
    }

    throw new Error('Não foi possível extrair os streams do YouTube para este vídeo.');
  }

  private static async fetchTwitterMedia(tweetId: string): Promise<{
    title: string;
    duration: number;
    thumbnail: string;
    uploader: string;
    videoUrl: string;
  }> {
    // Estratégia 1: FxTwitter API (JSON limpo com URL direta MP4 avc1+mp4a)
    try {
      const fxRes = await fetch(`https://api.fxtwitter.com/status/${tweetId}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; YesodeMediaEngine/1.0)',
        },
      });
      if (fxRes.ok) {
        const fxData = await fxRes.json();
        const tweet = fxData?.tweet;
        const video =
          tweet?.media?.videos?.[0] ||
          tweet?.media?.all?.find((m: any) => m.type === 'video' || m.type === 'gif');

        if (video?.url) {
          return {
            title:
              (tweet?.text ? tweet.text.slice(0, 60).trim() : '') ||
              `x-video-${tweetId}`,
            duration: Math.round(video.duration || 0),
            thumbnail: video.thumbnail_url || '',
            uploader: tweet?.author?.name || tweet?.author?.screen_name || 'X',
            videoUrl: video.url,
          };
        }
      }
    } catch {
      // Tenta fallback Syndication
    }

    // Estratégia 2: Twitter Syndication API oficial
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
      const mediaDetails = synData?.mediaDetails?.[0];
      const variants: Array<{ content_type: string; bitrate?: number; url: string }> =
        mediaDetails?.video_info?.variants || [];
      const mp4Variants = variants
        .filter((v) => v.content_type === 'video/mp4' && v.url)
        .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));

      if (mp4Variants.length > 0) {
        return {
          title:
            (synData?.text ? synData.text.slice(0, 60).trim() : '') ||
            `x-video-${tweetId}`,
          duration: Math.round(
            (mediaDetails?.video_info?.duration_millis || 0) / 1000
          ),
          thumbnail: mediaDetails?.media_url_https || '',
          uploader: synData?.user?.name || 'X',
          videoUrl: mp4Variants[0].url,
        };
      }
    }

    throw new Error('Não foi possível localizar um vídeo público neste post do X/Twitter.');
  }

  private static async fetchGenericOpenGraphVideo(targetUrl: string): Promise<{
    title: string;
    thumbnail: string;
    videoUrl: string;
  }> {
    // Para Instagram / Facebook, tenta extrair og:video ou vxinstagram
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
      throw new Error(`Falha ao acessar mídia (${res.status}).`);
    }

    const html = await res.text();
    const videoMatch =
      html.match(/<meta\s+property=["']og:video(?::secure_url)?["']\s+content=["']([^"']+)["']/i) ||
      html.match(/content=["']([^"']+)["']\s+property=["']og:video(?::secure_url)?["']/i);
    const titleMatch =
      html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
      html.match(/<title>([^<]+)<\/title>/i);
    const thumbMatch = html.match(
      /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i
    );

    if (!videoMatch?.[1]) {
      throw new Error('Não foi possível localizar o stream direto de vídeo nesta URL.');
    }

    return {
      title: titleMatch?.[1]?.trim() || 'social-video',
      thumbnail: thumbMatch?.[1] || '',
      videoUrl: videoMatch[1].replace(/&amp;/g, '&'),
    };
  }

  public static async getInfo(targetUrl: string): Promise<ServerlessMediaInfo> {
    const ytId = this.extractYouTubeId(targetUrl);
    if (ytId) {
      const { playerData } = await this.fetchYouTubePlayer(ytId);
      const details = playerData?.videoDetails || {};
      const thumbs = details?.thumbnail?.thumbnails || [];
      return {
        title: details.title || `youtube-${ytId}`,
        duration: Number(details.lengthSeconds || 0),
        thumbnail: thumbs[thumbs.length - 1]?.url || '',
        uploader: details.author || 'YouTube',
      };
    }

    const tweetId = this.extractTweetId(targetUrl);
    if (tweetId) {
      const info = await this.fetchTwitterMedia(tweetId);
      return {
        title: info.title,
        duration: info.duration,
        thumbnail: info.thumbnail,
        uploader: info.uploader,
      };
    }

    const og = await this.fetchGenericOpenGraphVideo(targetUrl);
    return {
      title: og.title,
      duration: 0,
      thumbnail: og.thumbnail,
      uploader: 'Social Media',
    };
  }

  public static async downloadBuffer(
    targetUrl: string,
    format: DownloadFormat,
    _profile: DownloadProfile = 'compatibility'
  ): Promise<ServerlessDownloadResult> {
    // 1. YouTube
    const ytId = this.extractYouTubeId(targetUrl);
    if (ytId) {
      const { playerData, userAgent } = await this.fetchYouTubePlayer(ytId);
      const title = playerData?.videoDetails?.title || `youtube-${ytId}`;
      const muxedFormats: any[] = playerData?.streamingData?.formats || [];
      const adaptiveFormats: any[] = playerData?.streamingData?.adaptiveFormats || [];

      let targetStream: any = null;
      let useRangeParam = false;
      let contentType = 'video/mp4';
      let extension = 'mp4';

      if (format === 'audio_only') {
        targetStream =
          adaptiveFormats.find(
            (f) => f.itag === 140 || (f.mimeType && f.mimeType.includes('audio/mp4'))
          ) ||
          adaptiveFormats.find((f) => f.mimeType && f.mimeType.includes('audio/'));
        useRangeParam = !!targetStream?.contentLength;
        contentType = 'audio/mp4';
        extension = 'm4a';
      } else if (format === 'video_only') {
        const avcStreams = adaptiveFormats
          .filter((f) => f.mimeType && f.mimeType.includes('video/mp4') && f.mimeType.includes('avc1'))
          .sort((a, b) => (b.height || 0) - (a.height || 0));
        targetStream = avcStreams[0] || muxedFormats.find((f) => f.itag === 18) || muxedFormats[0];
        useRangeParam = !!targetStream?.contentLength;
      } else {
        // video_muxed ou gif -> máxima compatibilidade H.264 + AAC pré-muxado (itag 18)
        targetStream =
          muxedFormats.find((f) => f.itag === 18) ||
          muxedFormats.find((f) => f.mimeType && f.mimeType.includes('video/mp4')) ||
          muxedFormats[0];
        useRangeParam = false;
      }

      if (!targetStream?.url) {
        throw new Error('Formato de stream compatível não encontrado para este vídeo do YouTube.');
      }

      const downloadUrl =
        useRangeParam && targetStream.contentLength
          ? `${targetStream.url}&range=0-${targetStream.contentLength}`
          : targetStream.url;

      const streamRes = await fetch(downloadUrl, {
        headers: {
          'User-Agent': userAgent,
        },
      });

      if (!streamRes.ok) {
        throw new Error(`Erro ao baixar stream do YouTube (HTTP ${streamRes.status}).`);
      }

      const buffer = Buffer.from(await streamRes.arrayBuffer());
      if (buffer.length < 500) {
        throw new Error('Stream retornado pelo YouTube está vazio ou incompleto.');
      }

      return {
        buffer,
        title,
        contentType,
        extension,
      };
    }

    // 2. X / Twitter
    const tweetId = this.extractTweetId(targetUrl);
    if (tweetId) {
      const info = await this.fetchTwitterMedia(tweetId);
      const streamRes = await fetch(info.videoUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        },
      });

      if (!streamRes.ok) {
        throw new Error(`Erro ao baixar vídeo do X/Twitter (HTTP ${streamRes.status}).`);
      }

      const buffer = Buffer.from(await streamRes.arrayBuffer());
      if (buffer.length < 500) {
        throw new Error('Stream retornado pelo X/Twitter está vazio.');
      }

      return {
        buffer,
        title: info.title,
        contentType: 'video/mp4',
        extension: 'mp4',
      };
    }

    // 3. Instagram / Facebook (OpenGraph / ddinstagram)
    const og = await this.fetchGenericOpenGraphVideo(targetUrl);
    const streamRes = await fetch(og.videoUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      },
    });

    if (!streamRes.ok) {
      throw new Error(`Erro ao baixar mídia social (HTTP ${streamRes.status}).`);
    }

    const buffer = Buffer.from(await streamRes.arrayBuffer());
    return {
      buffer,
      title: og.title,
      contentType: 'video/mp4',
      extension: 'mp4',
    };
  }
}

