import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import {
  Upload,
  Sparkles,
  Scissors,
  Download,
  Smile
} from 'lucide-react';
import { StickerSpec } from '../../domain/value-objects/StickerSpec.ts';
import './WhatsAppStickerWorkspace.scss';

export interface WhatsAppStickerWorkspaceProps {
  initialVideoUrl?: string;
}

export const WhatsAppStickerWorkspace: React.FC<WhatsAppStickerWorkspaceProps> = ({
  initialVideoUrl,
}) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string>(initialVideoUrl || '');
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(3);
  const [cropMode, setCropMode] = useState<'fit_pad' | 'square_crop'>('fit_pad');
  const [processing, setProcessing] = useState(false);
  const [generatedStickerUrl, setGeneratedStickerUrl] = useState<string>('');

  const toast = useRef<Toast>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (initialVideoUrl) {
      setVideoSrc(initialVideoUrl);
    }
  }, [initialVideoUrl]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/') && !file.type.includes('gif')) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Formato Inválido',
          detail: 'Por favor, envie um arquivo de vídeo (MP4/WebM) ou GIF.',
          life: 3000,
        });
        return;
      }
      setVideoFile(file);
      const objectUrl = URL.createObjectURL(file);
      setVideoSrc(objectUrl);
      setGeneratedStickerUrl('');
    }
  };

  const handleCreateSticker = async () => {
    try {
      const spec = StickerSpec.create(startTime, endTime, cropMode);
      setProcessing(true);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) {
        throw new Error('Elemento de mídia não inicializado.');
      }

      canvas.width = StickerSpec.TARGET_DIMENSION;
      canvas.height = StickerSpec.TARGET_DIMENSION;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Não foi possível obter contexto 2D do Canvas.');

      // Renderiza frame centralizado 512x512
      ctx.clearRect(0, 0, 512, 512);

      let sx = 0, sy = 0, sWidth = video.videoWidth || 512, sHeight = video.videoHeight || 512;
      let dx = 0, dy = 0, dWidth = 512, dHeight = 512;

      if (spec.cropMode === 'square_crop') {
        const minDim = Math.min(sWidth, sHeight);
        sx = (sWidth - minDim) / 2;
        sy = (sHeight - minDim) / 2;
        sWidth = minDim;
        sHeight = minDim;
      } else {
        const ratio = Math.min(512 / sWidth, 512 / sHeight);
        dWidth = sWidth * ratio;
        dHeight = sHeight * ratio;
        dx = (512 - dWidth) / 2;
        dy = (512 - dHeight) / 2;
      }

      ctx.drawImage(video, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

      // Converte para WebP
      const webpDataUrl = canvas.toDataURL('image/webp', 0.85);
      setGeneratedStickerUrl(webpDataUrl);
      setProcessing(false);

      toast.current?.show({
        severity: 'success',
        summary: 'Figurinha Gerada!',
        detail: 'Formato WebP 512x512 otimizado para WhatsApp criado com sucesso.',
        life: 3500,
      });
    } catch (err: any) {
      setProcessing(false);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro na Criação',
        detail: err.message || 'Falha ao processar o vídeo.',
        life: 4000,
      });
    }
  };

  const downloadSticker = () => {
    if (!generatedStickerUrl) return;
    const a = document.createElement('a');
    a.href = generatedStickerUrl;
    a.download = 'figurinha-whatsapp-yesode.webp';
    a.click();
  };

  return (
    <div className="ys-sticker-workspace">
      <Toast ref={toast} position="bottom-right" />

      <div className="ys-sticker-grid">
        {/* Left: Video input and settings */}
        <div className="ys-sticker-card ys-sticker-settings-card">
          <h3 className="ys-sticker-card-title">Sticker Studio — WhatsApp</h3>
          <p className="ys-sticker-card-subtitle">
            Transforme qualquer trecho de vídeo ou GIF em figurinha (Sticker WebP 512x512) dentro do padrão oficial do WhatsApp.
          </p>

          <div className="ys-sticker-upload-zone">
            <input
              type="file"
              id="sticker-file-input"
              className="ys-hidden-file"
              accept="video/*,image/gif"
              onChange={handleFileUpload}
            />
            <label htmlFor="sticker-file-input" className="ys-upload-label">
              <Upload size={24} className="ys-upload-icon" />
              <span className="ys-upload-text">
                {videoFile ? videoFile.name : 'Clique para selecionar um vídeo (MP4) ou GIF'}
              </span>
              <span className="ys-upload-subtext">Ou arraste seu arquivo aqui</span>
            </label>
          </div>

          {videoSrc && (
            <div className="ys-video-controls-section">
              <div className="ys-video-preview-wrapper">
                <video
                  ref={videoRef}
                  src={videoSrc}
                  className="ys-source-video"
                  controls
                  crossOrigin="anonymous"
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      setEndTime(Math.min(videoRef.current.duration || 3, 5));
                    }
                  }}
                />
              </div>

              {/* Trim Controls */}
              <div className="ys-trim-box">
                <div className="ys-trim-header">
                  <span className="ys-trim-title">
                    <Scissors size={14} /> Corte Temporal (Máx. 6 segundos)
                  </span>
                  <span className="ys-trim-duration">
                    Duração: <strong>{(endTime - startTime).toFixed(1)}s</strong>
                  </span>
                </div>

                <div className="ys-trim-inputs">
                  <div className="ys-field">
                    <label className="ys-field-label">Início (segundos):</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max={endTime - 0.5}
                      value={startTime}
                      className="ys-number-input"
                      onChange={(e) => setStartTime(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="ys-field">
                    <label className="ys-field-label">Fim (segundos):</label>
                    <input
                      type="number"
                      step="0.5"
                      min={startTime + 0.5}
                      value={endTime}
                      className="ys-number-input"
                      onChange={(e) => setEndTime(parseFloat(e.target.value) || 1)}
                    />
                  </div>
                </div>
              </div>

              {/* Crop Mode Selection */}
              <div className="ys-crop-modes">
                <label className="ys-field-label">Enquadramento 512x512:</label>
                <div className="ys-crop-buttons">
                  <button
                    type="button"
                    className={`ys-crop-btn ${cropMode === 'fit_pad' ? 'is-active' : ''}`}
                    onClick={() => setCropMode('fit_pad')}
                  >
                    <span>Ajustar (Fundo Transparente)</span>
                  </button>
                  <button
                    type="button"
                    className={`ys-crop-btn ${cropMode === 'square_crop' ? 'is-active' : ''}`}
                    onClick={() => setCropMode('square_crop')}
                  >
                    <span>Preencher (Corte Centralizado)</span>
                  </button>
                </div>
              </div>

              <Button
                className="p-button-primary ys-generate-sticker-btn"
                disabled={processing}
                onClick={handleCreateSticker}
              >
                <Sparkles size={16} />
                <span>{processing ? 'Processando WebP...' : 'Criar Figurinha WhatsApp'}</span>
              </Button>
            </div>
          )}
        </div>

        {/* Right: WhatsApp Chat Balloon Preview */}
        <div className="ys-sticker-card ys-sticker-preview-card">
          <h4 className="ys-preview-title">Visualização no WhatsApp</h4>

          {/* WhatsApp Chat Simulation */}
          <div className="ys-whatsapp-mock">
            <div className="ys-whatsapp-bubble">
              {generatedStickerUrl ? (
                <img
                  src={generatedStickerUrl}
                  alt="Figurinha WhatsApp"
                  className="ys-sticker-img"
                />
              ) : (
                <div className="ys-sticker-mock-empty">
                  <Smile size={48} opacity={0.3} />
                  <span>Sua figurinha WebP aparecerá aqui</span>
                </div>
              )}
              <span className="ys-whatsapp-time">12:00 ✓✓</span>
            </div>
          </div>

          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {generatedStickerUrl && (
            <div className="ys-sticker-download-area">
              <Button
                className="p-button-primary ys-download-sticker-btn"
                onClick={downloadSticker}
              >
                <Download size={16} />
                <span>Baixar Figurinha (.webp)</span>
              </Button>
              <p className="ys-sticker-tip">
                Dica: Envie o arquivo <code>.webp</code> diretamente para qualquer conversa no WhatsApp Web ou Mobile para salvá-la nos seus favoritos!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
