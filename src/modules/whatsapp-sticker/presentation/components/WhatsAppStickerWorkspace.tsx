import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import {
  Upload,
  Sparkles,
  Scissors,
  Download,
  Smile,
  Loader2,
  Crop,
  ZoomIn,
  Move,
  ShieldCheck,
  Camera,
  CheckCircle2,
  Info
} from 'lucide-react';
import { StickerSpec, type CropMode } from '../../domain/value-objects/StickerSpec.ts';
import { WhatsAppStickerExifService } from '../../infrastructure/WhatsAppStickerExifService.ts';
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
  const [videoDuration, setVideoDuration] = useState(0);

  // Recorte (Crop) State
  const [cropMode, setCropMode] = useState<CropMode>('custom_crop');
  const [zoom, setZoom] = useState(1.0);
  const [positionX, setPositionX] = useState(50); // 0 a 100%
  const [positionY, setPositionY] = useState(50); // 0 a 100%
  const [cropSize, setCropSize] = useState(100); // 30 a 100%

  // Metadados do Pacote WhatsApp (EXIF)
  const [packName, setPackName] = useState('Yesode Figurinhas');
  const [authorName, setAuthorName] = useState('Yesode Studio');

  const [processing, setProcessing] = useState(false);
  const [generatedStickerUrl, setGeneratedStickerUrl] = useState<string>('');
  const [livePreviewUrl, setLivePreviewUrl] = useState<string>('');

  const toast = useRef<Toast>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Auto-carrega vídeo quando enviado da aba de download
  useEffect(() => {
    if (initialVideoUrl) {
      setVideoSrc(initialVideoUrl);
      setGeneratedStickerUrl('');
      setLivePreviewUrl('');
    }
  }, [initialVideoUrl]);

  // Atualiza live preview sempre que o usuário mexe no crop ou no vídeo
  const updatePreview = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return;

    try {
      const spec = StickerSpec.create({
        startTime,
        endTime,
        cropMode,
        zoom,
        positionX,
        positionY,
        cropSize,
      });

      canvas.width = StickerSpec.TARGET_DIMENSION;
      canvas.height = StickerSpec.TARGET_DIMENSION;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, 512, 512);

      const rect = spec.calculateCropRect(video.videoWidth || 512, video.videoHeight || 512);
      ctx.drawImage(
        video,
        rect.sx,
        rect.sy,
        rect.sWidth,
        rect.sHeight,
        rect.dx,
        rect.dy,
        rect.dWidth,
        rect.dHeight
      );

      const previewDataUrl = canvas.toDataURL('image/webp', 0.85);
      setLivePreviewUrl(previewDataUrl);
    } catch (e) {
      // Ignora erros temporários de seek
    }
  }, [startTime, endTime, cropMode, zoom, positionX, positionY, cropSize]);

  // Dispara atualização de preview quando sliders mudam
  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

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
      setLivePreviewUrl('');
    }
  };

  const handleCreateSticker = async () => {
    try {
      const spec = StickerSpec.create({
        startTime,
        endTime,
        cropMode,
        zoom,
        positionX,
        positionY,
        cropSize,
      });

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

      ctx.clearRect(0, 0, 512, 512);

      const rect = spec.calculateCropRect(video.videoWidth || 512, video.videoHeight || 512);
      ctx.drawImage(
        video,
        rect.sx,
        rect.sy,
        rect.sWidth,
        rect.sHeight,
        rect.dx,
        rect.dy,
        rect.dWidth,
        rect.dHeight
      );

      // Renderiza WebP intermediário a partir do canvas
      const rawWebpDataUrl = canvas.toDataURL('image/webp', 0.90);

      // Injeta os metadados EXIF oficiais exigidos pelo WhatsApp
      const stickerBlob = await WhatsAppStickerExifService.processCanvasDataUrl(rawWebpDataUrl, {
        packName,
        authorName,
        emojis: ['✨', '🚀'],
      });

      const stickerBlobUrl = URL.createObjectURL(stickerBlob);
      setGeneratedStickerUrl(stickerBlobUrl);
      setProcessing(false);

      toast.current?.show({
        severity: 'success',
        summary: 'Figurinha WhatsApp Pronta!',
        detail: 'Metadados EXIF e dimensões 512x512 injetados com sucesso.',
        life: 4000,
      });
    } catch (err: any) {
      setProcessing(false);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro na Criação',
        detail: err.message || 'Falha ao processar vídeo.',
        life: 4000,
      });
    }
  };

  const downloadSticker = () => {
    if (!generatedStickerUrl) return;
    const a = document.createElement('a');
    a.href = generatedStickerUrl;
    a.download = `figurinha-whatsapp-${Date.now()}.webp`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast.current?.show({
      severity: 'info',
      summary: 'Download Concluído',
      detail: 'Arraste o arquivo .webp diretamente para qualquer conversa do WhatsApp!',
      life: 5000,
    });
  };

  return (
    <div className="ys-sticker-workspace">
      <Toast ref={toast} position="bottom-right" />

      <div className="ys-sticker-grid">
        {/* Left: Video input, Crop and settings */}
        <div className="ys-sticker-card ys-sticker-settings-card">
          <div className="ys-sticker-card-header">
            <h3 className="ys-sticker-card-title">Sticker Studio — WhatsApp</h3>
            <p className="ys-sticker-card-subtitle">
              Recorte, dê zoom e converta qualquer trecho de vídeo em figurinha (Sticker WebP 512×512) com <strong>metadados EXIF oficiais</strong> reconhecidos pelo WhatsApp.
            </p>
          </div>

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
                {videoFile ? videoFile.name : videoSrc ? 'Vídeo Carregado via Downloader' : 'Clique para selecionar um vídeo (MP4) ou GIF'}
              </span>
              <span className="ys-upload-subtext">Ou arraste seu arquivo aqui</span>
            </label>
          </div>

          {videoSrc && (
            <div className="ys-video-controls-section">
              {/* Player do Vídeo com Monitor de Tempo */}
              <div className="ys-video-preview-wrapper">
                <video
                  ref={videoRef}
                  src={videoSrc}
                  className="ys-source-video"
                  controls
                  crossOrigin="anonymous"
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      const dur = videoRef.current.duration || 3;
                      setVideoDuration(dur);
                      setEndTime(Math.min(dur, 4));
                      updatePreview();
                    }
                  }}
                  onSeeked={updatePreview}
                  onPause={updatePreview}
                />
              </div>

              {/* Botão para Capturar o Frame Exato */}
              <div className="ys-capture-row">
                <Button
                  type="button"
                  className="p-button-outlined p-button-sm ys-capture-btn"
                  onClick={updatePreview}
                >
                  <Camera size={14} />
                  <span>Capturar Frame do Vídeo Atual</span>
                </Button>
                <span className="ys-capture-hint">Pause ou arraste o vídeo no momento desejado</span>
              </div>

              {/* Seletor de Modo de Recorte (Crop) */}
              <div className="ys-crop-box-container">
                <div className="ys-crop-box-header">
                  <div className="ys-crop-title">
                    <Crop size={16} />
                    <span>Enquadramento e Recorte (Crop 512×512):</span>
                  </div>
                </div>

                <div className="ys-crop-mode-pills">
                  <button
                    type="button"
                    className={`ys-crop-pill ${cropMode === 'custom_crop' ? 'is-active' : ''}`}
                    onClick={() => setCropMode('custom_crop')}
                  >
                    <Move size={14} />
                    <span>Recorte Livre (Zoom & Posição)</span>
                  </button>
                  <button
                    type="button"
                    className={`ys-crop-pill ${cropMode === 'top_crop' ? 'is-active' : ''}`}
                    onClick={() => setCropMode('top_crop')}
                  >
                    <span>Topo (1:1 Celular)</span>
                  </button>
                  <button
                    type="button"
                    className={`ys-crop-pill ${cropMode === 'center_crop' ? 'is-active' : ''}`}
                    onClick={() => setCropMode('center_crop')}
                  >
                    <span>Centro (1:1)</span>
                  </button>
                  <button
                    type="button"
                    className={`ys-crop-pill ${cropMode === 'bottom_crop' ? 'is-active' : ''}`}
                    onClick={() => setCropMode('bottom_crop')}
                  >
                    <span>Base (1:1)</span>
                  </button>
                  <button
                    type="button"
                    className={`ys-crop-pill ${cropMode === 'fit_pad' ? 'is-active' : ''}`}
                    onClick={() => setCropMode('fit_pad')}
                  >
                    <span>Ajustar Inteiro (Transparente)</span>
                  </button>
                </div>

                {/* Controles Avançados de Recorte Livre (Sliders de Posição e Zoom) */}
                {cropMode === 'custom_crop' && (
                  <div className="ys-crop-sliders-card">
                    <div className="ys-slider-group">
                      <div className="ys-slider-label-row">
                        <label>
                          <ZoomIn size={14} /> Zoom / Escala da Figurinha:
                        </label>
                        <strong>{zoom.toFixed(1)}x</strong>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="3.0"
                        step="0.1"
                        value={zoom}
                        className="ys-slider-input"
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                      />
                    </div>

                    <div className="ys-slider-group">
                      <div className="ys-slider-label-row">
                        <label>Posição Vertical (Y):</label>
                        <strong>
                          {positionY <= 25 ? 'Topo' : positionY >= 75 ? 'Base' : 'Centro'} ({positionY}%)
                        </strong>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={positionY}
                        className="ys-slider-input"
                        onChange={(e) => setPositionY(parseInt(e.target.value, 10))}
                      />
                      <div className="ys-slider-ticks">
                        <span>Topo (0%)</span>
                        <span>Centro (50%)</span>
                        <span>Base (100%)</span>
                      </div>
                    </div>

                    <div className="ys-slider-group">
                      <div className="ys-slider-label-row">
                        <label>Posição Horizontal (X):</label>
                        <strong>
                          {positionX <= 25 ? 'Esquerda' : positionX >= 75 ? 'Direita' : 'Centro'} ({positionX}%)
                        </strong>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={positionX}
                        className="ys-slider-input"
                        onChange={(e) => setPositionX(parseInt(e.target.value, 10))}
                      />
                      <div className="ys-slider-ticks">
                        <span>Esquerda (0%)</span>
                        <span>Centro (50%)</span>
                        <span>Direita (100%)</span>
                      </div>
                    </div>

                    <div className="ys-slider-group">
                      <div className="ys-slider-label-row">
                        <label>Tamanho do Enquadramento:</label>
                        <strong>{cropSize}%</strong>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="100"
                        step="5"
                        value={cropSize}
                        className="ys-slider-input"
                        onChange={(e) => setCropSize(parseInt(e.target.value, 10))}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Trim Controls */}
              <div className="ys-trim-box">
                <div className="ys-trim-header">
                  <span className="ys-trim-title">
                    <Scissors size={14} /> Corte Temporal (Máx. 6 segundos)
                  </span>
                  <span className="ys-trim-duration">
                    Duração: <strong>{(endTime - startTime).toFixed(1)}s</strong> (Total: {videoDuration.toFixed(1)}s)
                  </span>
                </div>

                <div className="ys-trim-inputs">
                  <div className="ys-field">
                    <label className="ys-field-label">Início (segundos):</label>
                    <input
                      type="number"
                      step="0.2"
                      min="0"
                      max={endTime - 0.2}
                      value={startTime}
                      className="ys-number-input"
                      onChange={(e) => setStartTime(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="ys-field">
                    <label className="ys-field-label">Fim (segundos):</label>
                    <input
                      type="number"
                      step="0.2"
                      min={startTime + 0.2}
                      value={endTime}
                      className="ys-number-input"
                      onChange={(e) => setEndTime(parseFloat(e.target.value) || 1)}
                    />
                  </div>
                </div>
              </div>

              {/* Metadados do Pacote WhatsApp */}
              <div className="ys-exif-box">
                <div className="ys-exif-header">
                  <ShieldCheck size={16} color="#C4A962" />
                  <span>Metadados Oficiais WhatsApp (EXIF)</span>
                </div>
                <div className="ys-exif-inputs">
                  <div className="ys-field">
                    <label className="ys-field-label">Nome do Pacote:</label>
                    <input
                      type="text"
                      value={packName}
                      className="ys-text-input"
                      placeholder="Ex: Minhas Figurinhas"
                      onChange={(e) => setPackName(e.target.value)}
                    />
                  </div>
                  <div className="ys-field">
                    <label className="ys-field-label">Autor / Criador:</label>
                    <input
                      type="text"
                      value={authorName}
                      className="ys-text-input"
                      placeholder="Ex: Yesode"
                      onChange={(e) => setAuthorName(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Button
                className="p-button-primary ys-generate-sticker-btn"
                disabled={processing}
                onClick={handleCreateSticker}
              >
                {processing ? (
                  <>
                    <Loader2 size={18} className="ys-spin" />
                    <span>Processando Figurinha WebP com EXIF...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Criar Figurinha WhatsApp</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Right: WhatsApp Chat Balloon Preview and Download */}
        <div className="ys-sticker-card ys-sticker-preview-card">
          <div className="ys-preview-card-header">
            <h4 className="ys-preview-title">Visualização no WhatsApp</h4>
            <span className="ys-preview-badge">512 × 512 px</span>
          </div>

          {/* WhatsApp Chat Simulation */}
          <div className="ys-whatsapp-mock">
            <div className="ys-whatsapp-bubble">
              {generatedStickerUrl || livePreviewUrl ? (
                <img
                  src={generatedStickerUrl || livePreviewUrl}
                  alt="Figurinha WhatsApp"
                  className="ys-sticker-img"
                />
              ) : (
                <div className="ys-sticker-mock-empty">
                  <Smile size={48} opacity={0.3} />
                  <span>Sua figurinha WebP aparecerá aqui com recorte e transparência</span>
                </div>
              )}
              <span className="ys-whatsapp-time">12:00 ✓✓</span>
            </div>
          </div>

          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Botão de Download */}
          {generatedStickerUrl ? (
            <div className="ys-sticker-download-area">
              <Button
                className="p-button-primary ys-download-sticker-btn"
                onClick={downloadSticker}
              >
                <Download size={18} />
                <span>Salvar Figurinha (.webp) no Computador</span>
              </Button>

              {/* Guia de Compatibilidade do WhatsApp */}
              <div className="ys-whatsapp-guide-card">
                <div className="ys-guide-header">
                  <CheckCircle2 size={16} color="#10B981" />
                  <strong>Reconhecimento Oficial no WhatsApp:</strong>
                </div>
                <ul className="ys-guide-steps">
                  <li>
                    <strong>No WhatsApp Web / Desktop:</strong> Arraste o arquivo baixado diretamente para a conversa. Ele é enviado automaticamente como figurinha nativa (sem borda branca e com fundo transparente).
                  </li>
                  <li>
                    <strong>No WhatsApp do Celular:</strong> Envie o arquivo para o seu número ou toque nele na conversa e selecione <em>"Adicionar às Favoritas"</em>.
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="ys-preview-hint">
              <Info size={14} />
              <span>O preview acima reflete em tempo real os ajustes de corte e zoom. Clique em "Criar Figurinha WhatsApp" para embutir o EXIF e liberar o download.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
