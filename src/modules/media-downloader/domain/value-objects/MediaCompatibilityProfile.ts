export type DownloadFormat = 'video_muxed' | 'audio_only' | 'video_only' | 'gif';
export type DownloadProfile = 'compatibility' | 'whatsapp_4k' | 'studio_max';

export interface ProfileOption {
  id: DownloadProfile;
  nameKey: string;
  badgeKey: string;
  isRecommended: boolean;
  descriptionKey: string;
  container: 'mp4' | 'mkv';
  warningKey?: string;
}

export interface CodecSpec {
  videoCodec: string;
  audioCodec: string;
  container: 'mp4' | 'mp3' | 'gif' | 'mkv';
  formatSort: string[];
  postprocessorArgs: Record<string, string[]>;
  description: string;
}

export class MediaCompatibilityProfile {
  public static readonly DEFAULT_PROFILE: DownloadProfile = 'compatibility';

  public static readonly AVAILABLE_PROFILES: ProfileOption[] = [
    {
      id: 'compatibility',
      nameKey: 'tools.media.profiles.compatibility.name',
      badgeKey: 'tools.media.profiles.compatibility.badge',
      isRecommended: true,
      container: 'mp4',
      descriptionKey: 'tools.media.profiles.compatibility.description',
    },
    {
      id: 'whatsapp_4k',
      nameKey: 'tools.media.profiles.whatsapp_4k.name',
      badgeKey: 'tools.media.profiles.whatsapp_4k.badge',
      isRecommended: false,
      container: 'mp4',
      descriptionKey: 'tools.media.profiles.whatsapp_4k.description',
    },
    {
      id: 'studio_max',
      nameKey: 'tools.media.profiles.studio_max.name',
      badgeKey: 'tools.media.profiles.studio_max.badge',
      isRecommended: false,
      container: 'mkv',
      descriptionKey: 'tools.media.profiles.studio_max.description',
      warningKey: 'tools.media.profiles.studio_max.warning',
    },
  ];

  /**
   * Returns pipeline codec and container parameters for the requested format and profile.
   */
  public static getSpec(format: DownloadFormat, profile: DownloadProfile = 'compatibility'): CodecSpec {
    if (format === 'audio_only') {
      return {
        videoCodec: 'none',
        audioCodec: 'mp3',
        container: 'mp3',
        formatSort: ['acodec:mp3', 'abr:320'],
        postprocessorArgs: {
          merger: ['-c:a', 'libmp3lame', '-b:a', '320k'],
        },
        description: 'Universal MP3 320kbps audio.',
      };
    }

    if (format === 'gif') {
      return {
        videoCodec: 'gif',
        audioCodec: 'none',
        container: 'gif',
        formatSort: ['vcodec:h264'],
        postprocessorArgs: {
          merger: ['-vf', 'fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse'],
        },
        description: 'Optimized animated GIF.',
      };
    }

    if (format === 'video_only') {
      return {
        videoCodec: profile === 'compatibility' ? 'h264' : 'best',
        audioCodec: 'none',
        container: 'mp4',
        formatSort: profile === 'compatibility' ? ['vcodec:h264'] : ['bestvideo'],
        postprocessorArgs: {
          merger: ['-an', '-c:v', 'copy'],
        },
        description: 'Muted MP4 video stream.',
      };
    }

    if (profile === 'studio_max') {
      return {
        videoCodec: 'best',
        audioCodec: 'best',
        container: 'mkv',
        formatSort: ['bestvideo+bestaudio/best'],
        postprocessorArgs: {},
        description: 'Raw studio MKV stream.',
      };
    }

    if (profile === 'whatsapp_4k') {
      return {
        videoCodec: 'best',
        audioCodec: 'aac',
        container: 'mp4',
        formatSort: ['bestvideo+bestaudio/best'],
        postprocessorArgs: {
          merger: ['-c:a', 'aac', '-b:a', '512k', '-movflags', '+faststart'],
        },
        description: '4K MP4 with AAC audio.',
      };
    }

    return {
      videoCodec: 'h264',
      audioCodec: 'aac',
      container: 'mp4',
      formatSort: ['vcodec:h264', 'acodec:m4a', 'res:1080'],
      postprocessorArgs: {
        merger: ['-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart'],
      },
      description: 'Universal MP4 H.264 + AAC (+faststart).',
    };
  }
}
