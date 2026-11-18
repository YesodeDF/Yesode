import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import {
  Download,
  Video,
  Music,
  Film,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Loader2,
  Plus,
  RefreshCw,
  X,
  ShieldCheck,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { MediaSourceUrl } from '../../domain/value-objects/MediaSourceUrl.ts';
import {
  MediaCompatibilityProfile,
  type DownloadFormat,
  type DownloadProfile,
} from '../../domain/value-objects/MediaCompatibilityProfile.ts';
import './MediaDownloaderWorkspace.scss';

export interface QueueItem {
  id: string;
  rawUrl: string;
  media: MediaSourceUrl | null;
  title?: string;
  duration?: number;
  thumbnail?: string;
  status: 'idle' | 'analyzing' | 'ready' | 'downloading' | 'preparing_sticker' | 'completed' | 'error';
  progress: number;
  format: DownloadFormat;
  profile: DownloadProfile;
  errorMessage?: string;
  blobUrl?: string;
}

export interface MediaDownloaderWorkspaceProps {
  onSendToStickerMaker?: (videoBlobUrl: string) => void;
}

export const MediaDownloaderWorkspace: React.FC<MediaDownloaderWorkspaceProps> = ({
  onSendToStickerMaker,
}) => {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const toast = useRef<Toast>(null);

  const resolveErrorMessage = (err: any, fallbackKey: string): string => {
    if (err?.code) {
      const translated = t(`tools.errors.${err.code}`, { defaultValue: '' });
      if (translated) return translated;
    }
    return err?.message || t(fallbackKey);
  };

  const handleAddLinks = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = inputText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      toast.current?.show({
        severity: 'warn',
        summary: t('tools.media.toast_empty_summary'),
        detail: t('tools.media.toast_empty_detail'),
        life: 3000,
      });
      return;
    }

    const newItems: QueueItem[] = lines.map((url) => {
      let media: MediaSourceUrl | null = null;
      let status: QueueItem['status'] = 'ready';
      let errorMessage: string | undefined;

      try {
        media = MediaSourceUrl.create(url);
      } catch (err: any) {
        status = 'error';
        errorMessage = resolveErrorMessage(err, 'tools.errors.media_domain_error');
      }

      const itemId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      if (media) {
        fetch(`/api/tools/media-info?url=${encodeURIComponent(media.url)}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((info) => {
            if (info && info.title) {
              setQueue((prev) =>
                prev.map((q) =>
                  q.id === itemId
                    ? {
                      ...q,
                      title: info.title,
                      duration: info.duration,
                      thumbnail: info.thumbnail,
                    }
                    : q
                )
              );
            }
          })
          .catch(() => { });
      }

      return {
        id: itemId,
        rawUrl: url,
        media,
        status,
        progress: 0,
        format: 'video_muxed',
        profile: 'compatibility',
        errorMessage,
      };
    });

    setQueue((prev) => [...prev, ...newItems]);
    setInputText('');
  };

  const handleFormatChange = (id: string, format: DownloadFormat) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, format } : item))
    );
  };

  const handleProfileChange = (id: string, profile: DownloadProfile) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, profile } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const triggerBrowserDownload = (href: string, filename: string, openInNewTab = false) => {
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    if (openInNewTab) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchMediaPayload = async (
    queryUrl: string
  ): Promise<{ blob?: Blob; directUrl?: string; filename?: string }> => {
    const response = await fetch(queryUrl);
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || t('tools.media.err_server'));
    }

    const contentType = (response.headers.get('content-type') || '').toLowerCase();
    if (contentType.includes('application/json')) {
      const payload = await response.json();
      if (payload?.mode === 'direct_url' && payload?.directUrl) {
        return {
          directUrl: payload.directUrl,
          filename: payload.filename,
        };
      }
      throw new Error(payload?.error || t('tools.media.err_server'));
    }

    const blob = await response.blob();
    if (blob.size < 500) {
      const errorText = await blob.text();
      throw new Error(`${t('tools.media.err_invalid_blob')} (${blob.size} bytes): ${errorText.substring(0, 100)}`);
    }

    return { blob };
  };

  const handleStartDownload = async (id: string) => {
    const item = queue.find((q) => q.id === id);
    if (!item || !item.media) return;

    setQueue((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'downloading', progress: 5, errorMessage: undefined } : q))
    );

    try {
      const spec = MediaCompatibilityProfile.getSpec(item.format, item.profile);
      const queryParams = new URLSearchParams({
        url: item.media.url,
        format: item.format,
        profile: item.profile,
        container: spec.container,
      });

      let progressVal = 10;
      const progressTimer = setInterval(() => {
        if (progressVal < 85) {
          progressVal += 5;
          setQueue((prev) =>
            prev.map((q) => (q.id === id && q.status === 'downloading' ? { ...q, progress: progressVal } : q))
          );
        }
      }, 500);

      let result: { blob?: Blob; directUrl?: string; filename?: string };
      try {
        result = await fetchMediaPayload(`/api/tools/media-download?${queryParams.toString()}`);
      } finally {
        clearInterval(progressTimer);
      }

      setQueue((prev) =>
        prev.map((q) => (q.id === id ? { ...q, progress: 95 } : q))
      );

      const safeTitle = (item.title || `yesode-${item.media.platform}`)
        .replace(/[^a-zA-Z0-9_\-\u00C0-\u00FF]/g, '_')
        .substring(0, 45);
      const filename = result.filename || `${safeTitle}.${spec.container}`;

      let blobUrl: string | undefined;
      if (result.blob) {
        blobUrl = window.URL.createObjectURL(result.blob);
        triggerBrowserDownload(blobUrl, filename);
      } else if (result.directUrl) {
        try {
          const directRes = await fetch(result.directUrl);
          if (!directRes.ok) throw new Error(`HTTP ${directRes.status}`);
          const directBlob = await directRes.blob();
          blobUrl = window.URL.createObjectURL(directBlob);
          triggerBrowserDownload(blobUrl, filename);
        } catch {
          triggerBrowserDownload(result.directUrl, filename, true);
        }
      }

      setQueue((prev) =>
        prev.map((q) =>
          q.id === id
            ? { ...q, status: 'completed', progress: 100, blobUrl }
            : q
        )
      );

      toast.current?.show({
        severity: 'success',
        summary: t('tools.media.toast_success_summary'),
        detail: `${t('tools.media.toast_success_detail')} (${filename}).`,
        life: 4000,
      });
    } catch (err: any) {
      setQueue((prev) =>
        prev.map((q) =>
          q.id === id
            ? { ...q, status: 'error', progress: 0, errorMessage: err.message || t('tools.media.error_fallback') }
            : q
        )
      );

      toast.current?.show({
        severity: 'error',
        summary: t('tools.media.toast_fail_summary'),
        detail: err.message || t('tools.media.toast_fail_detail'),
        life: 4000,
      });
    }
  };

  const handleConvertToSticker = async (id: string) => {
    const item = queue.find((q) => q.id === id);
    if (!item || !item.media || !onSendToStickerMaker) return;

    setQueue((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'preparing_sticker' } : q))
    );

    try {
      let videoBlobUrl = item.blobUrl;
      if (!videoBlobUrl) {
        const result = await fetchMediaPayload(
          `/api/tools/media-download?url=${encodeURIComponent(item.media.url)}&format=video_muxed&profile=compatibility`
        );
        if (result.blob) {
          videoBlobUrl = window.URL.createObjectURL(result.blob);
        } else if (result.directUrl) {
          const directRes = await fetch(result.directUrl);
          if (!directRes.ok) throw new Error(`HTTP ${directRes.status}`);
          const directBlob = await directRes.blob();
          videoBlobUrl = window.URL.createObjectURL(directBlob);
        }
      }

      if (!videoBlobUrl) {
        throw new Error(t('tools.media.error_fallback'));
      }

      setQueue((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: 'ready' } : q))
      );

      onSendToStickerMaker(videoBlobUrl);
    } catch {
      setQueue((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: 'ready' } : q))
      );
      toast.current?.show({
        severity: 'warn',
        summary: t('tools.media.toast_sticker_summary'),
        detail: t('tools.media.toast_sticker_detail'),
        life: 3000,
      });
      onSendToStickerMaker(item.media.url);
    }
  };

  return (
    <div className="ys-media-downloader">
      <Toast ref={toast} position="bottom-right" />

      <div className="ys-downloader-container">
        <div className="ys-downloader-card">
          <div className="ys-downloader-header">
            <h3 className="ys-downloader-title">{t('tools.media.title')}</h3>
            <p className="ys-downloader-subtitle">
              {t('tools.media.subtitle_prefix')} <strong>{t('tools.media.subtitle_bold')}</strong> {t('tools.media.subtitle_suffix')}
            </p>
          </div>

          <div className="ys-compatibility-banner">
            <div className="ys-compatibility-icon">
              <ShieldCheck size={20} color="#C4A962" />
            </div>
            <div className="ys-compatibility-body">
              <strong>{t('tools.media.compat_title')}</strong>
              <span>
                {t('tools.media.compat_desc_1')} <strong>{t('tools.media.compat_desc_bold1')}</strong> {t('tools.media.compat_desc_and')}{' '}
                <strong>{t('tools.media.compat_desc_bold2')}</strong>
                {t('tools.media.compat_desc_2')}
              </span>
            </div>
          </div>

          <form className="ys-multi-input-form" onSubmit={handleAddLinks}>
            <div className="ys-multi-input-wrapper">
              <label className="ys-input-headline" htmlFor="media-links-textarea">
                {t('tools.media.input_label')}
              </label>
              <textarea
                id="media-links-textarea"
                rows={3}
                value={inputText}
                placeholder={t('tools.media.input_placeholder')}
                className="ys-multi-textarea"
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
            <Button type="submit" className="p-button-primary ys-add-queue-btn">
              <Plus size={18} />
              <span>{t('tools.media.add_btn')}</span>
            </Button>
          </form>

          <div className="ys-platform-chips">
            <span className="ys-chip">{t('tools.media.chip_yt')}</span>
            <span className="ys-chip">{t('tools.media.chip_x')}</span>
            <span className="ys-chip">{t('tools.media.chip_ig')}</span>
            <span className="ys-chip">{t('tools.media.chip_fb')}</span>
          </div>

          {queue.length > 0 && (
            <div className="ys-queue-container">
              <div className="ys-queue-header">
                <div className="ys-queue-title-wrap">
                  <h4>{t('tools.media.queue_title')} ({queue.length})</h4>
                  <span className="ys-queue-hint">{t('tools.media.queue_hint')}</span>
                </div>
                <Button
                  className="p-button-text p-button-sm ys-clear-all"
                  onClick={() => setQueue([])}
                >
                  {t('tools.media.clear_queue')}
                </Button>
              </div>

              <div className="ys-queue-list">
                {queue.map((item) => (
                  <div key={item.id} className={`ys-queue-card status-${item.status}`}>
                    <div className="ys-card-top-row">
                      <div className="ys-card-meta">
                        <Video size={20} className="ys-meta-icon" />
                        <div className="ys-meta-text">
                          <span className="ys-platform-label">
                            {item.title ? item.title : (item.media ? item.media.platformDisplayName : t('tools.media.unknown_link'))}
                          </span>
                          <span className="ys-url-preview" title={item.rawUrl}>
                            {item.media ? `[${item.media.platformDisplayName}] ${item.rawUrl}` : item.rawUrl}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="ys-remove-btn"
                        onClick={() => handleRemoveItem(item.id)}
                        title={t('tools.media.remove_title')}
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {item.media && item.status !== 'completed' && (
                      <div className="ys-card-settings-grid">
                        <div className="ys-setting-group">
                          <span className="ys-setting-label">{t('tools.media.format_label')}</span>
                          <div className="ys-format-pills">
                            <button
                              type="button"
                              className={`ys-format-pill ${item.format === 'video_muxed' ? 'is-active' : ''}`}
                              onClick={() => handleFormatChange(item.id, 'video_muxed')}
                              disabled={item.status === 'downloading' || item.status === 'preparing_sticker'}
                            >
                              <Video size={14} />
                              <span>{t('tools.media.format_video')}</span>
                            </button>
                            <button
                              type="button"
                              className={`ys-format-pill ${item.format === 'audio_only' ? 'is-active' : ''}`}
                              onClick={() => handleFormatChange(item.id, 'audio_only')}
                              disabled={item.status === 'downloading' || item.status === 'preparing_sticker'}
                            >
                              <Music size={14} />
                              <span>{t('tools.media.format_audio')}</span>
                            </button>
                            <button
                              type="button"
                              className={`ys-format-pill ${item.format === 'video_only' ? 'is-active' : ''}`}
                              onClick={() => handleFormatChange(item.id, 'video_only')}
                              disabled={item.status === 'downloading' || item.status === 'preparing_sticker'}
                            >
                              <Film size={14} />
                              <span>{t('tools.media.format_video_only')}</span>
                            </button>
                            {(item.media.platform === 'twitter' || item.media.platform === 'youtube') && (
                              <button
                                type="button"
                                className={`ys-format-pill ${item.format === 'gif' ? 'is-active' : ''}`}
                                onClick={() => handleFormatChange(item.id, 'gif')}
                                disabled={item.status === 'downloading' || item.status === 'preparing_sticker'}
                              >
                                <Sparkles size={14} />
                                <span>{t('tools.media.format_gif')}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {(item.format === 'video_muxed' || item.format === 'video_only') && (
                          <div className="ys-setting-group">
                            <div className="ys-setting-label-row">
                              <span className="ys-setting-label">{t('tools.media.profile_label')}</span>
                              {item.profile === 'compatibility' && (
                                <span className="ys-pill-badge-recommended">
                                  <ShieldCheck size={12} /> {t('tools.media.profile_total')}
                                </span>
                              )}
                            </div>
                            <div className="ys-profile-selector">
                              {MediaCompatibilityProfile.AVAILABLE_PROFILES.map((prof) => (
                                <button
                                  key={prof.id}
                                  type="button"
                                  className={`ys-profile-pill ${item.profile === prof.id ? 'is-active' : ''} ${prof.isRecommended ? 'is-recommended' : ''}`}
                                  onClick={() => handleProfileChange(item.id, prof.id)}
                                  disabled={item.status === 'downloading' || item.status === 'preparing_sticker'}
                                >
                                  <span className="ys-profile-name">{t(prof.nameKey)}</span>
                                  {prof.isRecommended && <span className="ys-badge-tag">{t('tools.media.profile_default_tag')}</span>}
                                </button>
                              ))}
                            </div>

                            {item.profile === 'studio_max' && (
                              <div className="ys-profile-warning">
                                <AlertTriangle size={14} />
                                <span>{t('tools.media.profile_studio_warn')}</span>
                              </div>
                            )}

                            {item.profile === 'compatibility' && (
                              <div className="ys-profile-info">
                                <Info size={14} />
                                <span>{t('tools.media.profile_compat_info')}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {item.status === 'downloading' && (
                      <div className="ys-card-progress-bar">
                        <div className="ys-progress-track">
                          <div
                            className="ys-progress-fill"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <div className="ys-progress-info">
                          <span>{t('tools.media.progress_label')}</span>
                          <strong>{item.progress}%</strong>
                        </div>
                      </div>
                    )}

                    {item.status === 'error' && (
                      <div className="ys-card-error-banner">
                        <span>{item.errorMessage || t('tools.media.error_fallback')}</span>
                        <Button
                          className="p-button-outlined p-button-sm ys-retry-btn"
                          onClick={() => handleStartDownload(item.id)}
                        >
                          <RefreshCw size={14} />
                          <span>{t('tools.media.retry_btn')}</span>
                        </Button>
                      </div>
                    )}

                    {item.status === 'completed' && (
                      <div className="ys-card-success-banner">
                        <CheckCircle2 size={18} color="#10B981" />
                        <span>{t('tools.media.completed_label')}</span>
                      </div>
                    )}

                    <div className="ys-card-actions">
                      {item.status !== 'completed' && item.status !== 'error' && (
                        <Button
                          className="p-button-primary p-button-sm ys-start-download-btn"
                          disabled={item.status === 'downloading' || item.status === 'preparing_sticker'}
                          onClick={() => handleStartDownload(item.id)}
                        >
                          {item.status === 'downloading' ? (
                            <>
                              <Loader2 size={16} className="ys-spin" />
                              <span>{t('tools.media.downloading_btn')} ({item.progress}%)...</span>
                            </>
                          ) : (
                            <>
                              <Download size={16} />
                              <span>{t('tools.media.download_btn')}</span>
                            </>
                          )}
                        </Button>
                      )}

                      {onSendToStickerMaker && item.media && (
                        <Button
                          className="p-button-outlined p-button-sm ys-make-sticker-btn"
                          disabled={item.status === 'downloading' || item.status === 'preparing_sticker'}
                          onClick={() => handleConvertToSticker(item.id)}
                        >
                          {item.status === 'preparing_sticker' ? (
                            <>
                              <Loader2 size={16} className="ys-spin" />
                              <span>{t('tools.media.preparing_sticker_btn')}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles size={16} />
                              <span>{t('tools.media.make_sticker_btn')}</span>
                              <ArrowRight size={14} />
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
