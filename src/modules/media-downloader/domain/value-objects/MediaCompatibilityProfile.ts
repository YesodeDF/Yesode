export type DownloadFormat = 'video_muxed' | 'audio_only' | 'video_only' | 'gif';
export type DownloadProfile = 'compatibility' | 'whatsapp_4k' | 'studio_max';

export interface ProfileOption {
  id: DownloadProfile;
  name: string;
  badge: string;
  isRecommended: boolean;
  description: string;
  container: 'mp4' | 'mkv';
  warning?: string;
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
      name: 'Máxima Compatibilidade (WhatsApp / Universal)',
      badge: 'Recomendado',
      isRecommended: true,
      container: 'mp4',
      description: 'H.264 + AAC em MP4 estrito. Roda liso e nativo em qualquer celular Android, iPhone, WhatsApp Web e TVs sem travamentos.'
    },
    {
      id: 'whatsapp_4k',
      name: 'WhatsApp 4K (Documento MP4)',
      badge: 'Alta Definição',
      isRecommended: false,
      container: 'mp4',
      description: 'Vídeo em altíssima resolução com áudio estéreo AAC (512k) transcodificado para compatibilidade.'
    },
    {
      id: 'studio_max',
      name: 'Máxima Qualidade (Estúdio / MKV)',
      badge: 'Profissional',
      isRecommended: false,
      container: 'mkv',
      description: 'Fluxo bruto de estúdio (AV1/VP9 + Opus). Ideal para edição no Premiere e DaVinci Resolve.',
      warning: 'Atenção: codecs de estúdio não rodam no WhatsApp e podem travar em celulares comuns.'
    }
  ];

  /**
   * Retorna os parâmetros exatos do pipeline com base no formato e perfil selecionado.
   * Sempre prioriza Máxima Compatibilidade (H.264 + AAC) como padrão.
   */
  public static getSpec(format: DownloadFormat, profile: DownloadProfile = 'compatibility'): CodecSpec {
    if (format === 'audio_only') {
      return {
        videoCodec: 'none',
        audioCodec: 'mp3',
        container: 'mp3',
        formatSort: ['acodec:mp3', 'abr:320'],
        postprocessorArgs: {
          merger: ['-c:a', 'libmp3lame', '-b:a', '320k']
        },
        description: 'Áudio MP3 320kbps Universal (Compatível com 100% dos reprodutores de som).'
      };
    }

    if (format === 'gif') {
      return {
        videoCodec: 'gif',
        audioCodec: 'none',
        container: 'gif',
        formatSort: ['vcodec:h264'],
        postprocessorArgs: {
          merger: ['-vf', 'fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse']
        },
        description: 'GIF animado leve com paleta otimizada para compartilhamento.'
      };
    }

    if (format === 'video_only') {
      return {
        videoCodec: profile === 'compatibility' ? 'h264' : 'best',
        audioCodec: 'none',
        container: 'mp4',
        formatSort: profile === 'compatibility' ? ['vcodec:h264'] : ['bestvideo'],
        postprocessorArgs: {
          merger: ['-an', '-c:v', 'copy']
        },
        description: 'Vídeo MP4 sem áudio (Mudo).'
      };
    }

    // format === 'video_muxed'
    if (profile === 'studio_max') {
      return {
        videoCodec: 'best',
        audioCodec: 'best',
        container: 'mkv',
        formatSort: ['bestvideo+bestaudio/best'],
        postprocessorArgs: {},
        description: 'Arquivo MKV bruto com melhor resolução e áudio original de estúdio.'
      };
    }

    if (profile === 'whatsapp_4k') {
      return {
        videoCodec: 'best',
        audioCodec: 'aac',
        container: 'mp4',
        formatSort: ['bestvideo+bestaudio/best'],
        postprocessorArgs: {
          merger: ['-c:a', 'aac', '-b:a', '512k', '-movflags', '+faststart']
        },
        description: 'MP4 4K com áudio AAC compatível para envio como documento no WhatsApp.'
      };
    }

    // Default: 'compatibility'
    return {
      videoCodec: 'h264',
      audioCodec: 'aac',
      container: 'mp4',
      formatSort: ['vcodec:h264', 'acodec:m4a', 'res:1080'],
      postprocessorArgs: {
        merger: ['-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart']
      },
      description: 'MP4 Universal H.264 + AAC (+faststart). Roda em qualquer celular, TV e WhatsApp sem travar.'
    };
  }
}

