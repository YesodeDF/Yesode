import type {
  DownloadFormat,
  DownloadProfile,
} from '../domain/value-objects/MediaCompatibilityProfile.ts';
import { MediaSourceUrl } from '../domain/value-objects/MediaSourceUrl.ts';

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

export interface ResolvedMediaStream {
  streamUrl: string;
  title: string;
  contentType: string;
  extension: string;
  contentLength?: number;
  requestHeaders: Record<string, string>;
  browserDirectSafe: boolean;
}

const DEFAULT_BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const DISCORD_CRAWLER_UA = 'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)';
const REQUEST_TIMEOUT_MS = 12000;

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

function resolveAbsoluteUrl(candidate: string, baseUrl: string): string {
  try {
    return new URL(candidate, baseUrl).toString();
  } catch {
    return candidate;
  }
}

/**
 * Extrator 100% Node.js nativo (Zero Python / Zero Binários Externos)
 * Projetado especificamente para rodar no runtime Serverless da Vercel e como fallback local.
 */
export class ServerlessMediaExtractor {
  private static async probeStreamHeaders(
    streamUrl: string,
    headers: Record<string, string>
  ): Promise<{ contentLength?: number; contentType?: string }> {
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
        };
      }
    } catch {
      // Alguns servidores retornam 405 em HEAD; tenta GET com Range mínimo
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
      await rangeRes.body?.cancel().catch(() => {});

      const parsedLen = rawLen ? Number(rawLen) : NaN;
      return {
        contentLength: Number.isFinite(parsedLen) && parsedLen > 0 ? parsedLen : undefined,
        contentType: ct,
      };
    } catch {
      return {};
    }
  }

  private static async fetchYouTubePlayer(videoId: string): Promise<{
    playerData: any;
    userAgent: string;
  }> {
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
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
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

  private static async resolveYouTubePipedStream(
    videoId: string,
    format: DownloadFormat
  ): Promise<ResolvedMediaStream | null> {
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
    return null;
  }

  private static async fetchTwitterMedia(tweetId: string): Promise<{
    title: string;
    duration: number;
    thumbnail: string;
    uploader: string;
    videoUrl: string;
  }> {
    try {
      const fxRes = await fetch(`https://api.fxtwitter.com/status/${tweetId}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; YesodeMediaEngine/1.0)',
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
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

  private static async resolveSocialMirror(
    mirrorUrl: string,
    fallbackTitle: string,
    defaultUploader: string
  ): Promise<{
    title: string;
    thumbnail: string;
    uploader: string;
    videoUrl: string;
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
        title: fallbackTitle,
        thumbnail: '',
        uploader: defaultUploader,
        videoUrl: finalUrl,
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

    const videoUrl = resolveAbsoluteUrl(rawVideoUrl, res.url || mirrorUrl);
    if (!/^https?:\/\//i.test(videoUrl)) {
      throw new Error('URL de vídeo extraída é inválida.');
    }

    const ogTitle =
      extractMetaTag(html, 'og:title') ||
      extractMetaTag(html, 'twitter:title') ||
      decodeHtmlEntities(html.match(/<title>([^<]+)<\/title>/i)?.[1] || '');
    const ogDesc = extractMetaTag(html, 'og:description');
    const title = ogTitle || (ogDesc ? ogDesc.slice(0, 70) : '') || fallbackTitle;
    const rawThumb = extractMetaTag(html, 'og:image');

    return {
      title,
      thumbnail: rawThumb ? resolveAbsoluteUrl(rawThumb, res.url || mirrorUrl) : '',
      uploader: ogTitle || defaultUploader,
      videoUrl,
    };
  }

  private static async fetchInstagramMedia(targetUrl: string): Promise<{
    title: string;
    thumbnail: string;
    uploader: string;
    videoUrl: string;
    contentLength?: number;
  }> {
    const target = MediaSourceUrl.extractInstagramTarget(targetUrl);
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
        return await this.resolveSocialMirror(mirror, fallbackTitle, 'Instagram');
      } catch (err: any) {
        errors.push(err?.message || mirror);
      }
    }

    throw new Error(
      `Não foi possível extrair o vídeo público deste link do Instagram (${errors[0] || 'sem resposta'}). Verifique se o perfil é público.`
    );
  }

  private static async fetchGenericOpenGraphVideo(targetUrl: string): Promise<{
    title: string;
    thumbnail: string;
    uploader: string;
    videoUrl: string;
    contentLength?: number;
  }> {
    return this.resolveSocialMirror(targetUrl, 'social-video', 'Social Media');
  }

  public static async getInfo(targetUrl: string): Promise<ServerlessMediaInfo> {
    const ytId = MediaSourceUrl.extractYouTubeId(targetUrl);
    if (ytId) {
      try {
        const oembedRes = await fetch(
          `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${ytId}`)}&format=json`,
          { signal: AbortSignal.timeout(8000) }
        );
        if (oembedRes.ok) {
          const oembed = await oembedRes.json();
          return {
            title: oembed.title || `youtube-${ytId}`,
            duration: 0,
            thumbnail: oembed.thumbnail_url || `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
            uploader: oembed.author_name || 'YouTube',
          };
        }
      } catch {
        // Fallback para player completo abaixo
      }

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

    const tweetId = MediaSourceUrl.extractTweetId(targetUrl);
    if (tweetId) {
      const info = await this.fetchTwitterMedia(tweetId);
      return {
        title: info.title,
        duration: info.duration,
        thumbnail: info.thumbnail,
        uploader: info.uploader,
      };
    }

    const igTarget = MediaSourceUrl.extractInstagramTarget(targetUrl);
    if (igTarget) {
      const info = await this.fetchInstagramMedia(targetUrl);
      return {
        title: info.title,
        duration: 0,
        thumbnail: info.thumbnail,
        uploader: info.uploader,
      };
    }

    const og = await this.fetchGenericOpenGraphVideo(targetUrl);
    return {
      title: og.title,
      duration: 0,
      thumbnail: og.thumbnail,
      uploader: og.uploader,
    };
  }

  public static async resolveStream(
    targetUrl: string,
    format: DownloadFormat,
    _profile: DownloadProfile = 'compatibility'
  ): Promise<ResolvedMediaStream> {
    // 1. YouTube
    const ytId = MediaSourceUrl.extractYouTubeId(targetUrl);
    if (ytId) {
      try {
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
          targetStream =
            muxedFormats.find((f) => f.itag === 18) ||
            muxedFormats.find((f) => f.mimeType && f.mimeType.includes('video/mp4')) ||
            muxedFormats[0];
          useRangeParam = false;
        }

        if (targetStream?.url) {
          const downloadUrl =
            useRangeParam && targetStream.contentLength
              ? `${targetStream.url}&range=0-${targetStream.contentLength}`
              : targetStream.url;

          const parsedLen = targetStream.contentLength ? Number(targetStream.contentLength) : undefined;
          return {
            streamUrl: downloadUrl,
            title,
            contentType,
            extension,
            contentLength: Number.isFinite(parsedLen) && parsedLen! > 0 ? parsedLen : undefined,
            requestHeaders: { 'User-Agent': userAgent },
            browserDirectSafe: false,
          };
        }
      } catch {
        // Fallback Piped abaixo
      }

      const piped = await this.resolveYouTubePipedStream(ytId, format);
      if (piped) return piped;
      throw new Error('Formato de stream compatível não encontrado para este vídeo do YouTube.');
    }

    // 2. X / Twitter
    const tweetId = MediaSourceUrl.extractTweetId(targetUrl);
    if (tweetId) {
      const info = await this.fetchTwitterMedia(tweetId);
      const headers = { 'User-Agent': DEFAULT_BROWSER_UA };
      const probe = await this.probeStreamHeaders(info.videoUrl, headers);
      return {
        streamUrl: info.videoUrl,
        title: info.title,
        contentType: 'video/mp4',
        extension: 'mp4',
        contentLength: probe.contentLength,
        requestHeaders: headers,
        browserDirectSafe: true,
      };
    }

    // 3. Instagram
    const igTarget = MediaSourceUrl.extractInstagramTarget(targetUrl);
    if (igTarget) {
      const info = await this.fetchInstagramMedia(targetUrl);
      const headers = { 'User-Agent': DEFAULT_BROWSER_UA };
      const contentLength =
        info.contentLength || (await this.probeStreamHeaders(info.videoUrl, headers)).contentLength;

      return {
        streamUrl: info.videoUrl,
        title: info.title,
        contentType: 'video/mp4',
        extension: 'mp4',
        contentLength,
        requestHeaders: headers,
        browserDirectSafe: true,
      };
    }

    // 4. Facebook / Genérico
    const og = await this.fetchGenericOpenGraphVideo(targetUrl);
    const headers = { 'User-Agent': DEFAULT_BROWSER_UA };
    const contentLength =
      og.contentLength || (await this.probeStreamHeaders(og.videoUrl, headers)).contentLength;

    return {
      streamUrl: og.videoUrl,
      title: og.title,
      contentType: 'video/mp4',
      extension: 'mp4',
      contentLength,
      requestHeaders: headers,
      browserDirectSafe: true,
    };
  }

  public static async fetchBufferWithLimit(
    resolved: ResolvedMediaStream,
    maxBytes?: number
  ): Promise<{ buffer?: Buffer; exceededLimit: boolean }> {
    if (maxBytes && resolved.contentLength && resolved.contentLength > maxBytes) {
      return { exceededLimit: true };
    }

    const streamRes = await fetch(resolved.streamUrl, {
      headers: resolved.requestHeaders,
      redirect: 'follow',
      signal: AbortSignal.timeout(30000),
    });

    if (!streamRes.ok) {
      await streamRes.body?.cancel().catch(() => {});
      throw new Error(`Erro ao baixar arquivo de mídia (HTTP ${streamRes.status}).`);
    }

    const ct = (streamRes.headers.get('content-type') || '').toLowerCase();
    if (ct.includes('text/html')) {
      await streamRes.body?.cancel().catch(() => {});
      throw new Error('O provedor retornou uma página HTML em vez de um fluxo de mídia válido.');
    }

    const headerLen = Number(streamRes.headers.get('content-length') || 0);
    if (maxBytes && headerLen > maxBytes) {
      await streamRes.body?.cancel().catch(() => {});
      return { exceededLimit: true };
    }

    if (!streamRes.body) {
      const buffer = Buffer.from(await streamRes.arrayBuffer());
      if (maxBytes && buffer.length > maxBytes) {
        return { exceededLimit: true };
      }
      if (buffer.length < 500) {
        throw new Error('Stream de mídia retornado está vazio ou incompleto.');
      }
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
        if (maxBytes && total > maxBytes) {
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

  public static async downloadBuffer(
    targetUrl: string,
    format: DownloadFormat,
    profile: DownloadProfile = 'compatibility'
  ): Promise<ServerlessDownloadResult> {
    const resolved = await this.resolveStream(targetUrl, format, profile);
    const { buffer } = await this.fetchBufferWithLimit(resolved);

    if (!buffer) {
      throw new Error('Falha ao transferir buffer da mídia.');
    }

    return {
      buffer,
      title: resolved.title,
      contentType: resolved.contentType,
      extension: resolved.extension,
    };
  }
}
