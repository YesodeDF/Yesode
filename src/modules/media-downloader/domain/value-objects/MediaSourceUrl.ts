import { UnsupportedPlatformError, MediaSecurityError } from '../exceptions/MediaErrors.ts';

export type SupportedPlatform = 'youtube' | 'twitter' | 'instagram' | 'facebook';

export class MediaSourceUrl {
  private readonly _url: string;
  private readonly _platform: SupportedPlatform;

  private constructor(url: string, platform: SupportedPlatform) {
    this._url = url;
    this._platform = platform;
  }

  public static create(raw: string): MediaSourceUrl {
    const trimmed = (raw || '').trim();
    if (!trimmed) {
      throw new UnsupportedPlatformError('Por favor, cole um link de mídia.');
    }

    let parsed: URL;
    try {
      parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    } catch {
      throw new MediaSecurityError('Formato de URL inválido.');
    }

    const host = parsed.hostname.toLowerCase();

    // Proteção contra SSRF e IPs privados/locais
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.startsWith('192.168.') ||
      host.startsWith('10.') ||
      host.startsWith('172.16.')
    ) {
      throw new MediaSecurityError('Endereço IP ou anfitrião local não permitido.');
    }

    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      return new MediaSourceUrl(parsed.toString(), 'youtube');
    }

    if (host.includes('x.com') || host.includes('twitter.com')) {
      return new MediaSourceUrl(parsed.toString(), 'twitter');
    }

    if (host.includes('instagram.com')) {
      return new MediaSourceUrl(parsed.toString(), 'instagram');
    }

    if (host.includes('facebook.com') || host.includes('fb.watch') || host.includes('fb.com')) {
      return new MediaSourceUrl(parsed.toString(), 'facebook');
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
