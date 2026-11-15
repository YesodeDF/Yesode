import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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
  Info,
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
  const { t } = useTranslation();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string>(initialVideoUrl || '');
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(3);
  const [videoDuration, setVideoDuration] = useState(0);

  const [cropMode, setCropMode] = useState<CropMode>('custom_crop');
  const [zoom, setZoom] = useState(1.0);
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(50);
  const [cropSize, setCropSize] = useState(100);

  const [packName, setPackName] = useState(() => t('tools.sticker.default_pack_name'));
  const [authorName, setAuthorName] = useState('Yesode Studio');

  const [processing, setProcessing] = useState(false);
  const [generatedStickerUrl, setGeneratedStickerUrl] = useState<string>('');
  const [livePreviewUrl, setLivePreviewUrl] = useState<string>('');

  const toast = useRef<Toast>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (initialVideoUrl) {
      setVideoSrc(initialVideoUrl);
      setGeneratedStickerUrl('');
      setLivePreviewUrl('');
    }
  }, [initialVideoUrl]);

  const resolveErrorMessage = (err: any, fallbackKey: string): string => {
    if (err?.code) {
      const translated = t(`tools.errors.${err.code}`, { defaultValue: '' });
      if (translated) return translated;
    }
    return err?.message || t(fallbackKey);
  };

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
    } catch {
      // Ignore transient seek errors while scrubbing
    }
  }, [startTime, endTime, cropMode, zoom, positionX, positionY, cropSize]);

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/') && !file.type.includes('gif')) {
        toast.current?.show({
          severity: 'warn',
          summary: t('tools.sticker.toast_invalid_summary'),
          detail: t('tools.sticker.toast_invalid_detail'),
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
        throw new Error('Media element not initialized.');
      }

      canvas.width = StickerSpec.TARGET_DIMENSION;
      canvas.height = StickerSpec.TARGET_DIMENSION;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Unable to acquire 2D Canvas context.');

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

      const rawWebpDataUrl = canvas.toDataURL('image/webp', 0.9);

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
        summary: t('tools.sticker.toast_ready_summary'),
        detail: t('tools.sticker.toast_ready_detail'),
        life: 4000,
      });
    } catch (err: any) {
      setProcessing(false);
      toast.current?.show({
        severity: 'error',
        summary: t('tools.sticker.toast_err_summary'),
        detail: resolveErrorMessage(err, 'tools.sticker.toast_err_detail'),
        life: 4000,
      });
    }
  };

  const downloadSticker = () => {
    if (!generatedStickerUrl) return;
    const a = document.createElement('a');
    a.href = generatedStickerUrl;
    a.download = `whatsapp-sticker-${Date.now()}.webp`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast.current?.show({
      severity: 'info',
      summary: t('tools.sticker.toast_dl_summary'),
      detail: t('tools.sticker.toast_dl_detail'),
      life: 5000,
    });
  };

  return (
    <div className="ys-sticker-workspace">
      <Toast ref={toast} position="bottom-right" />

      <div className="ys-sticker-grid">
        <div className="ys-sticker-card ys-sticker-settings-card">
          <div className="ys-sticker-card-header">
            <h3 className="ys-sticker-card-title">{t('tools.sticker.title')}</h3>
            <p className="ys-sticker-card-subtitle">
              {t('tools.sticker.subtitle_prefix')} <strong>{t('tools.sticker.subtitle_bold')}</strong> {t('tools.sticker.subtitle_suffix')}
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
                {videoFile ? videoFile.name : videoSrc ? t('tools.sticker.upload_loaded') : t('tools.sticker.upload_prompt')}
              </span>
              <span className="ys-upload-subtext">{t('tools.sticker.upload_subtext')}</span>
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

              <div className="ys-capture-row">
                <Button
                  type="button"
                  className="p-button-outlined p-button-sm ys-capture-btn"
                  onClick={updatePreview}
                >
                  <Camera size={14} />
                  <span>{t('tools.sticker.capture_btn')}</span>
                </Button>
                <span className="ys-capture-hint">{t('tools.sticker.capture_hint')}</span>
              </div>

              <div className="ys-crop-box-container">
                <div className="ys-crop-box-header">
                  <div className="ys-crop-title">
                    <Crop size={16} />
                    <span>{t('tools.sticker.crop_title')}</span>
                  </div>
                </div>

                <div className="ys-crop-mode-pills">
                  <button
                    type="button"
                    className={`ys-crop-pill ${cropMode === 'custom_crop' ? 'is-active' : ''}`}
                    onClick={() => setCropMode('custom_crop')}
                  >
                    <Move size={14} />
                    <span>{t('tools.sticker.crop_custom')}</span>
                  </button>
                  <button
                    type="button"
                    className={`ys-crop-pill ${cropMode === 'top_crop' ? 'is-active' : ''}`}
                    onClick={() => setCropMode('top_crop')}
                  >
                    <span>{t('tools.sticker.crop_top')}</span>
                  </button>
                  <button
                    type="button"
                    className={`ys-crop-pill ${cropMode === 'center_crop' ? 'is-active' : ''}`}
                    onClick={() => setCropMode('center_crop')}
                  >
                    <span>{t('tools.sticker.crop_center')}</span>
                  </button>
                  <button
                    type="button"
                    className={`ys-crop-pill ${cropMode === 'bottom_crop' ? 'is-active' : ''}`}
                    onClick={() => setCropMode('bottom_crop')}
                  >
                    <span>{t('tools.sticker.crop_bottom')}</span>
                  </button>
                  <button
                    type="button"
                    className={`ys-crop-pill ${cropMode === 'fit_pad' ? 'is-active' : ''}`}
                    onClick={() => setCropMode('fit_pad')}
                  >
                    <span>{t('tools.sticker.crop_fit')}</span>
                  </button>
                </div>

                {cropMode === 'custom_crop' && (
                  <div className="ys-crop-sliders-card">
                    <div className="ys-slider-group">
                      <div className="ys-slider-label-row">
                        <label>
                          <ZoomIn size={14} /> {t('tools.sticker.zoom_label')}
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
                        <label>{t('tools.sticker.pos_y_label')}</label>
                        <strong>
                          {positionY <= 25 ? t('tools.sticker.pos_top') : positionY >= 75 ? t('tools.sticker.pos_bottom') : t('tools.sticker.pos_center')} ({positionY}%)
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
                        <span>{t('tools.sticker.pos_top')} (0%)</span>
                        <span>{t('tools.sticker.pos_center')} (50%)</span>
                        <span>{t('tools.sticker.pos_bottom')} (100%)</span>
                      </div>
                    </div>

                    <div className="ys-slider-group">
                      <div className="ys-slider-label-row">
                        <label>{t('tools.sticker.pos_x_label')}</label>
                        <strong>
                          {positionX <= 25 ? t('tools.sticker.pos_left') : positionX >= 75 ? t('tools.sticker.pos_right') : t('tools.sticker.pos_center')} ({positionX}%)
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
                        <span>{t('tools.sticker.pos_left')} (0%)</span>
                        <span>{t('tools.sticker.pos_center')} (50%)</span>
                        <span>{t('tools.sticker.pos_right')} (100%)</span>
                      </div>
                    </div>

                    <div className="ys-slider-group">
                      <div className="ys-slider-label-row">
                        <label>{t('tools.sticker.crop_size_label')}</label>
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

              <div className="ys-trim-box">
                <div className="ys-trim-header">
                  <span className="ys-trim-title">
                    <Scissors size={14} /> {t('tools.sticker.trim_title')}
                  </span>
                  <span className="ys-trim-duration">
                    {t('tools.sticker.trim_duration')} <strong>{(endTime - startTime).toFixed(1)}s</strong> ({t('tools.sticker.trim_total')} {videoDuration.toFixed(1)}s)
                  </span>
                </div>

                <div className="ys-trim-inputs">
                  <div className="ys-field">
                    <label className="ys-field-label">{t('tools.sticker.trim_start')}</label>
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
                    <label className="ys-field-label">{t('tools.sticker.trim_end')}</label>
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

              <div className="ys-exif-box">
                <div className="ys-exif-header">
                  <ShieldCheck size={16} color="#C4A962" />
                  <span>{t('tools.sticker.exif_title')}</span>
                </div>
                <div className="ys-exif-inputs">
                  <div className="ys-field">
                    <label className="ys-field-label">{t('tools.sticker.pack_label')}</label>
                    <input
                      type="text"
                      value={packName}
                      className="ys-text-input"
                      placeholder={t('tools.sticker.pack_placeholder')}
                      onChange={(e) => setPackName(e.target.value)}
                    />
                  </div>
                  <div className="ys-field">
                    <label className="ys-field-label">{t('tools.sticker.author_label')}</label>
                    <input
                      type="text"
                      value={authorName}
                      className="ys-text-input"
                      placeholder={t('tools.sticker.author_placeholder')}
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
                    <span>{t('tools.sticker.processing_btn')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>{t('tools.sticker.create_btn')}</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="ys-sticker-card ys-sticker-preview-card">
          <div className="ys-preview-card-header">
            <h4 className="ys-preview-title">{t('tools.sticker.preview_title')}</h4>
            <span className="ys-preview-badge">512 × 512 px</span>
          </div>

          <div className="ys-whatsapp-mock">
            <div className="ys-whatsapp-bubble">
              {generatedStickerUrl || livePreviewUrl ? (
                <img
                  src={generatedStickerUrl || livePreviewUrl}
                  alt={t('tools.sticker.preview_alt')}
                  className="ys-sticker-img"
                />
              ) : (
                <div className="ys-sticker-mock-empty">
                  <Smile size={48} opacity={0.3} />
                  <span>{t('tools.sticker.preview_empty')}</span>
                </div>
              )}
              <span className="ys-whatsapp-time">12:00 ✓✓</span>
            </div>
          </div>

          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {generatedStickerUrl ? (
            <div className="ys-sticker-download-area">
              <Button
                className="p-button-primary ys-download-sticker-btn"
                onClick={downloadSticker}
              >
                <Download size={18} />
                <span>{t('tools.sticker.download_btn')}</span>
              </Button>

              <div className="ys-whatsapp-guide-card">
                <div className="ys-guide-header">
                  <CheckCircle2 size={16} color="#10B981" />
                  <strong>{t('tools.sticker.guide_title')}</strong>
                </div>
                <ul className="ys-guide-steps">
                  <li>
                    <strong>{t('tools.sticker.guide_web_label')}</strong> {t('tools.sticker.guide_web_text')}
                  </li>
                  <li>
                    <strong>{t('tools.sticker.guide_mobile_label')}</strong> {t('tools.sticker.guide_mobile_text')}
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="ys-preview-hint">
              <Info size={14} />
              <span>{t('tools.sticker.preview_hint')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
