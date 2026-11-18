import { UnsupportedPlatformError, MediaSecurityError } from '../exceptions/MediaErrors.ts';

export type SupportedPlatform = 'youtube' | 'twitter' | 'instagram' | 'facebook';

export interface InstagramTarget {
  kind: 'reel' | 'p' | 'tv';
  shortcode: string;
}

const INSTAGRAM_HOSTS = ['instagram.com', 'ddinstagram.com', 'vxinstagram.com', 'kkinstagram.com'];
const TRACKING_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'igsh',
  'igshid',
  'jplx',
  'fbclid',
  's',
  't',
]);

export class MediaSourceUrl {
  private readonly _url: string;
  private readonly _platform: SupportedPlatform;

  private constructor(url: string, platform: SupportedPlatform) {
    this._url = url;
    this._platform = platform;
  }

  public static isYouTubeHost(host: string): boolean {
    const h = host.toLowerCase();
    return h === 'youtu.be' || h.endsWith('.youtu.be') || h === 'youtube.com' || h.endsWith('.youtube.com');
  }

  public static isTwitterHost(host: string): boolean {
    const h = host.toLowerCase();
    return h === 'x.com' || h.endsWith('.x.com') || h === 'twitter.com' || h.endsWith('.twitter.com');
  }

  public static isInstagramHost(host: string): boolean {
    const h = host.toLowerCase();
    return INSTAGRAM_HOSTS.some((domain) => h === domain || h.endsWith(`.${domain}`));
  }

  public static isFacebookHost(host: string): boolean {
    const h = host.toLowerCase();
    return (
      h === 'facebook.com' ||
      h.endsWith('.facebook.com') ||
      h === 'fb.watch' ||
      h.endsWith('.fb.watch') ||
      h === 'fb.com' ||
      h.endsWith('.fb.com')
    );
  }

  public static extractYouTubeId(rawUrl: string): string | null {
    try {
      const parsed = new URL(rawUrl);
      if (!this.isYouTubeHost(parsed.hostname)) {
        return null;
      }
      if (parsed.hostname.toLowerCase().includes('youtu.be')) {
        const id = parsed.pathname.split('/').filter(Boolean)[0] || null;
        return id && /^[0-9A-Za-z_-]{11}$/.test(id) ? id : null;
      }
      const vParam = parsed.searchParams.get('v');
      if (vParam && /^[0-9A-Za-z_-]{11}$/.test(vParam)) {
        return vParam;
      }
      const pathParts = parsed.pathname.split('/').filter(Boolean);
      const markerIdx = pathParts.findIndex((p) => ['shorts', 'embed', 'v', 'live'].includes(p));
      if (markerIdx !== -1 && pathParts[markerIdx + 1]) {
        const candidate = pathParts[markerIdx + 1];
        if (/^[0-9A-Za-z_-]{11}$/.test(candidate)) {
          return candidate;
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  public static extractTweetId(rawUrl: string): string | null {
    try {
      const parsed = new URL(rawUrl);
      if (!this.isTwitterHost(parsed.hostname)) {
        return null;
      }
      const match = parsed.pathname.match(/(?:status|statuses)\/(\d+)/i);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  public static extractInstagramTarget(rawUrl: string): InstagramTarget | null {
    try {
      const parsed = new URL(rawUrl);
      if (!this.isInstagramHost(parsed.hostname)) {
        return null;
      }
      const match = parsed.pathname.match(/(?:^|\/)(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i);
      if (!match) return null;
      const rawKind = match[1].toLowerCase();
      const kind: InstagramTarget['kind'] = rawKind === 'p' ? 'p' : rawKind === 'tv' ? 'tv' : 'reel';
      return { kind, shortcode: match[2] };
    } catch {
      return null;
    }
  }

  private static normalizeUrl(parsed: URL, platform: SupportedPlatform): string {
    if (platform === 'instagram') {
      const target = this.extractInstagramTarget(parsed.toString());
      if (target) {
        return `https://www.instagram.com/${target.kind}/${target.shortcode}/`;
      }
    }

    for (const key of [...parsed.searchParams.keys()]) {
      if (TRACKING_PARAMS.has(key.toLowerCase())) {
        parsed.searchParams.delete(key);
      }
    }
    return parsed.toString();
  }

  public static create(raw: string): MediaSourceUrl {
    const trimmed = (raw || '').trim();
    if (!trimmed) {
      throw new UnsupportedPlatformError('Please paste a media link.');
    }

    let parsed: URL;
    try {
      parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    } catch {
      throw new MediaSecurityError('Invalid URL format.');
    }

    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      throw new MediaSecurityError('Only HTTP/HTTPS URLs are allowed.');
    }

    const host = parsed.hostname.toLowerCase();

    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.startsWith('192.168.') ||
      host.startsWith('10.') ||
      host.startsWith('172.16.') ||
      host.startsWith('169.254.') ||
      host.endsWith('.internal') ||
      host.endsWith('.local')
    ) {
      throw new MediaSecurityError('Local or private IP host is not allowed.');
    }

    if (this.isYouTubeHost(host)) {
      return new MediaSourceUrl(this.normalizeUrl(parsed, 'youtube'), 'youtube');
    }

    if (this.isTwitterHost(host)) {
      return new MediaSourceUrl(this.normalizeUrl(parsed, 'twitter'), 'twitter');
    }

    if (this.isInstagramHost(host)) {
      return new MediaSourceUrl(this.normalizeUrl(parsed, 'instagram'), 'instagram');
    }

    if (this.isFacebookHost(host)) {
      return new MediaSourceUrl(this.normalizeUrl(parsed, 'facebook'), 'facebook');
    }

    throw new UnsupportedPlatformError();
  }

  public get url(): string {
    return this._url;
  }

  public get platform(): SupportedPlatform {
    return this._platform;
  }

  public get platformDisplayName(): string {
    switch (this._platform) {
      case 'youtube':
        return 'YouTube';
      case 'twitter':
        return 'X (Twitter)';
      case 'instagram':
        return 'Instagram';
      case 'facebook':
        return 'Facebook';
    }
  }
}
