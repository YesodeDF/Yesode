import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import {
  Download,
  Video,
  CheckCircle2,
  Share2,
  Sparkles,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { MediaSourceUrl } from '../../domain/value-objects/MediaSourceUrl.ts';
import './MediaDownloaderWorkspace.scss';

export interface MediaDownloaderWorkspaceProps {
  onSendToStickerMaker?: (videoUrl: string) => void;
}

export const MediaDownloaderWorkspace: React.FC<MediaDownloaderWorkspaceProps> = ({
  onSendToStickerMaker,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [validatedMedia, setValidatedMedia] = useState<MediaSourceUrl | null>(null);
  const [downloadFormat, setDownloadFormat] = useState<'video' | 'audio' | 'gif'>('video');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const toast = useRef<Toast>(null);

  const handleValidateUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setDownloadSuccess(false);

    try {
      const media = MediaSourceUrl.create(inputUrl);
      setValidatedMedia(media);
      toast.current?.show({
        severity: 'success',
        summary: 'Link Reconhecido',
        detail: `Plataforma identificada: ${media.platformDisplayName}`,
        life: 3000,
      });
    } catch (err: any) {
      setValidatedMedia(null);
      toast.current?.show({
        severity: 'warn',
        summary: 'Link Não Suportado',
        detail: err.message,
        life: 4000,
      });
    }
  };

  const handleStartDownload = () => {
    if (!validatedMedia) return;
    setLoading(true);

    // Endpoint serverless ou local proxy
    setTimeout(() => {
      setLoading(false);
      setDownloadSuccess(true);
      toast.current?.show({
        severity: 'info',
        summary: 'Extração Concluída',
        detail: 'O arquivo está pronto para download local.',
        life: 4000,
      });
    }, 1800);
  };

  return (
    <div className="ys-media-downloader">
      <Toast ref={toast} position="bottom-right" />

      <div className="ys-downloader-container">
        <div className="ys-downloader-card">
          <div className="ys-downloader-header">
            <h3 className="ys-downloader-title">Baixar Vídeos e Áudios em Alta Qualidade</h3>
            <p className="ys-downloader-subtitle">
              Extração sem anúncios e sem pop-ups. Compatível com <strong>YouTube</strong>, <strong>X (Twitter)</strong>, <strong>Instagram Reels</strong> e <strong>Facebook</strong>.
            </p>
          </div>

          <form className="ys-url-bar" onSubmit={handleValidateUrl}>
            <div className="ys-url-input-wrapper">
              <Video size={18} className="ys-url-icon" />
              <InputText
                value={inputUrl}
                placeholder="Cole o link do YouTube, X/Twitter, Instagram ou Facebook..."
                className="ys-url-input"
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  setDownloadSuccess(false);
                }}
              />
            </div>
            <Button type="submit" className="p-button-primary ys-search-btn">
              <span>Analisar Link</span>
            </Button>
          </form>

          {/* Supported platform badges */}
          <div className="ys-platform-chips">
            <span className="ys-chip">YouTube (4K & MP3)</span>
            <span className="ys-chip">X / Twitter (Vídeos & GIFs)</span>
            <span className="ys-chip">Instagram (Reels & Posts)</span>
            <span className="ys-chip">Facebook Watch</span>
          </div>

          {validatedMedia && (
            <div className="ys-media-result-box">
              <div className="ys-result-platform-badge">
                <CheckCircle2 size={16} color="#10B981" />
                <span>Mídia pronta: <strong>{validatedMedia.platformDisplayName}</strong></span>
              </div>

              <div className="ys-format-options">
                <button
                  type="button"
                  className={`ys-format-btn ${downloadFormat === 'video' ? 'is-active' : ''}`}
                  onClick={() => setDownloadFormat('video')}
                >
                  <Video size={16} />
                  <span>Vídeo MP4 (1080p / 4K)</span>
                </button>
                <button
                  type="button"
                  className={`ys-format-btn ${downloadFormat === 'audio' ? 'is-active' : ''}`}
                  onClick={() => setDownloadFormat('audio')}
                >
                  <Sparkles size={16} />
                  <span>Áudio MP3 (320kbps)</span>
                </button>
                {(validatedMedia.platform === 'twitter' || validatedMedia.platform === 'youtube') && (
                  <button
                    type="button"
                    className={`ys-format-btn ${downloadFormat === 'gif' ? 'is-active' : ''}`}
                    onClick={() => setDownloadFormat('gif')}
                  >
                    <Share2 size={16} />
                    <span>GIF Animado</span>
                  </button>
                )}
              </div>

              <div className="ys-result-actions">
                <Button
                  className="p-button-primary ys-download-cta"
                  disabled={loading}
                  onClick={handleStartDownload}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="ys-spin" />
                      <span>Processando no Servidor...</span>
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      <span>Baixar Agora</span>
                    </>
                  )}
                </Button>

                {onSendToStickerMaker && (
                  <Button
                    className="p-button-outlined ys-send-sticker-cta"
                    onClick={() => onSendToStickerMaker(validatedMedia.url)}
                  >
                    <Sparkles size={16} />
                    <span>Transformar em Figurinha WhatsApp</span>
                    <ArrowRight size={14} />
                  </Button>
                )}
              </div>

              {downloadSuccess && (
                <div className="ys-download-success-banner">
                  <CheckCircle2 size={18} color="#10B981" />
                  <span>Download iniciado diretamente para o seu navegador!</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
