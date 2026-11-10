import React, { useState, useRef } from 'react';
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
  Info
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
  const [inputText, setInputText] = useState('');
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const toast = useRef<Toast>(null);

  // Adicionar um ou múltiplos links à fila
  const handleAddLinks = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = inputText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Link Vazio',
        detail: 'Por favor, insira pelo menos um link para download.',
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
        errorMessage = err.message || 'Link inválido ou não suportado.';
      }

      const itemId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      // Busca metadados instantâneos de forma assíncrona
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
          .catch(() => {});
      }

      return {
        id: itemId,
        rawUrl: url,
        media,
        status,
        progress: 0,
        format: 'video_muxed',
        profile: 'compatibility', // Sempre inicia com Máxima Compatibilidade por padrão
        errorMessage,
      };
    });

    setQueue((prev) => [...prev, ...newItems]);
    setInputText('');
  };

  // Alterar formato de um item específico na fila
  const handleFormatChange = (id: string, format: DownloadFormat) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, format } : item))
    );
  };

  // Alterar perfil de compatibilidade de um item específico
  const handleProfileChange = (id: string, profile: DownloadProfile) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, profile } : item))
    );
  };

  // Remover item da fila
  const handleRemoveItem = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  // Executar download individual assíncrono com salvamento real no PC
  const handleStartDownload = async (id: string) => {
    const item = queue.find((q) => q.id === id);
    if (!item || !item.media) return;

    // Atualiza apenas este card para status downloading
    setQueue((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'downloading', progress: 5, errorMessage: undefined } : q))
    );

    try {
      const spec = MediaCompatibilityProfile.getSpec(item.format, item.profile);
      const queryParams = new URLSearchParams({
        url: item.media.url,
        format: item.format,
        profile: item.profile,
        container: spec.container
      });

      // Progresso suave visual enquanto o backend processa o download/muxing
      let progressVal = 10;
      const progressTimer = setInterval(() => {
        if (progressVal < 85) {
          progressVal += 5;
          setQueue((prev) =>
            prev.map((q) => (q.id === id && q.status === 'downloading' ? { ...q, progress: progressVal } : q))
          );
        }
      }, 500);

      // Chamada real para extração / proxy de download com stream
      const response = await fetch(`/api/tools/media-download?${queryParams.toString()}`);
      clearInterval(progressTimer);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Falha no servidor ao processar o vídeo. Tente novamente.');
      }

      setQueue((prev) =>
        prev.map((q) => (q.id === id ? { ...q, progress: 95 } : q))
      );

      const blob = await response.blob();

      if (blob.size < 500) {
        // Arquivo corrompido ou texto de erro retornado
        const errorText = await blob.text();
        throw new Error(`Arquivo retornado inválido (${blob.size} bytes): ${errorText.substring(0, 100)}`);
      }

      const safeTitle = (item.title || `yesode-${item.media.platform}`)
        .replace(/[^a-zA-Z0-9_\-\u00C0-\u00FF]/g, '_')
        .substring(0, 45);
      const filename = `${safeTitle}.${spec.container}`;

      // DISPARO REAL DE DOWNLOAD NO COMPUTADOR DO USUÁRIO
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Conclui com sucesso
      setQueue((prev) =>
        prev.map((q) =>
          q.id === id
            ? { ...q, status: 'completed', progress: 100, blobUrl }
            : q
        )
      );

      toast.current?.show({
        severity: 'success',
        summary: 'Download Concluído',
        detail: `Arquivo salvo com sucesso em seu computador (${filename}).`,
        life: 4000,
      });

    } catch (err: any) {
      setQueue((prev) =>
        prev.map((q) =>
          q.id === id
            ? { ...q, status: 'error', progress: 0, errorMessage: err.message || 'O download falhou. Clique em tentar de novo.' }
            : q
        )
      );

      toast.current?.show({
        severity: 'error',
        summary: 'Falha no Download',
        detail: err.message || 'Erro ao extrair vídeo.',
        life: 4000,
      });
    }
  };

  // Preparar mídia com loader e navegar para o criador de figurinhas
  const handleConvertToSticker = async (id: string) => {
    const item = queue.find((q) => q.id === id);
    if (!item || !item.media || !onSendToStickerMaker) return;

    setQueue((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'preparing_sticker' } : q))
    );

    try {
      let videoBlobUrl = item.blobUrl;
      if (!videoBlobUrl) {
        const resp = await fetch(`/api/tools/media-download?url=${encodeURIComponent(item.media.url)}&format=video_muxed&profile=compatibility`);
        const blob = await resp.blob();
        videoBlobUrl = window.URL.createObjectURL(blob);
      }

      setQueue((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: 'ready' } : q))
      );

      onSendToStickerMaker(videoBlobUrl);

    } catch (err: any) {
      setQueue((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: 'ready' } : q))
      );
      toast.current?.show({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Redirecionando para o Sticker Studio para carregar o arquivo.',
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
            <h3 className="ys-downloader-title">Baixar Vídeos e Áudios em Alta Qualidade</h3>
            <p className="ys-downloader-subtitle">
              Extração sem anúncios, sem limites e com salvamento direto na sua máquina. Cole <strong>um ou vários links</strong> do YouTube, X, Instagram ou Facebook.
            </p>
          </div>

          {/* Banner de Garantia de Máxima Compatibilidade Universal */}
          <div className="ys-compatibility-banner">
            <div className="ys-compatibility-icon">
              <ShieldCheck size={20} color="#C4A962" />
            </div>
            <div className="ys-compatibility-body">
              <strong>Perfil Padrão: Máxima Compatibilidade Universal</strong>
              <span>
                Todos os downloads são gerados por padrão em contêiner <strong>MP4 seguro (H.264 + AAC)</strong> e <strong>MP3 320k</strong>, garantindo que o vídeo rode instantaneamente em qualquer smartphone, WhatsApp e TV, sem travamentos de codec de estúdio.
              </span>
            </div>
          </div>

          {/* Form para adicionar 1 ou múltiplos links com espaçamento generoso */}
          <form className="ys-multi-input-form" onSubmit={handleAddLinks}>
            <div className="ys-multi-input-wrapper">
              <label className="ys-input-headline" htmlFor="media-links-textarea">
                Cole aqui um ou vários links (um por linha):
              </label>
              <textarea
                id="media-links-textarea"
                rows={3}
                value={inputText}
                placeholder="Exemplo:&#10;https://www.youtube.com/watch?v=...&#10;https://x.com/user/status/..."
                className="ys-multi-textarea"
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
            <Button type="submit" className="p-button-primary ys-add-queue-btn">
              <Plus size={18} />
              <span>Adicionar à Fila</span>
            </Button>
          </form>

          {/* Supported platform chips */}
          <div className="ys-platform-chips">
            <span className="ys-chip">YouTube (1080p, 4K e MP3)</span>
            <span className="ys-chip">X / Twitter (Vídeos e GIFs)</span>
            <span className="ys-chip">Instagram (Reels, Posts e Vídeos)</span>
            <span className="ys-chip">Facebook Watch</span>
          </div>

          {/* Fila Assíncrona de Downloads */}
          {queue.length > 0 && (
            <div className="ys-queue-container">
              <div className="ys-queue-header">
                <div className="ys-queue-title-wrap">
                  <h4>Fila de Mídias ({queue.length})</h4>
                  <span className="ys-queue-hint">Cada link é baixado de forma independente.</span>
                </div>
                <Button
                  className="p-button-text p-button-sm ys-clear-all"
                  onClick={() => setQueue([])}
                >
                  Limpar Fila
                </Button>
              </div>

              <div className="ys-queue-list">
                {queue.map((item) => (
                  <div key={item.id} className={`ys-queue-card status-${item.status}`}>
                    {/* Header do Card com Plataforma e Botão Fechar */}
                    <div className="ys-card-top-row">
                      <div className="ys-card-meta">
                        <Video size={20} className="ys-meta-icon" />
                        <div className="ys-meta-text">
                          <span className="ys-platform-label">
                            {item.title ? item.title : (item.media ? item.media.platformDisplayName : 'Link Desconhecido')}
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
                        title="Remover da fila"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {/* Controles de Formato e Perfil */}
                    {item.media && item.status !== 'completed' && (
                      <div className="ys-card-settings-grid">
                        {/* Seletor de Formato */}
                        <div className="ys-setting-group">
                          <span className="ys-setting-label">Formato do Arquivo:</span>
                          <div className="ys-format-pills">
                            <button
                              type="button"
                              className={`ys-format-pill ${item.format === 'video_muxed' ? 'is-active' : ''}`}
                              onClick={() => handleFormatChange(item.id, 'video_muxed')}
                              disabled={item.status === 'downloading' || item.status === 'preparing_sticker'}
                            >
                              <Video size={14} />
                              <span>Vídeo MP4</span>
                            </button>
                            <button
                              type="button"
                              className={`ys-format-pill ${item.format === 'audio_only' ? 'is-active' : ''}`}
                              onClick={() => handleFormatChange(item.id, 'audio_only')}
                              disabled={item.status === 'downloading' || item.status === 'preparing_sticker'}
                            >
                              <Music size={14} />
                              <span>Áudio MP3 (320k)</span>
                            </button>
                            <button
                              type="button"
                              className={`ys-format-pill ${item.format === 'video_only' ? 'is-active' : ''}`}
                              onClick={() => handleFormatChange(item.id, 'video_only')}
                              disabled={item.status === 'downloading' || item.status === 'preparing_sticker'}
                            >
                              <Film size={14} />
                              <span>Somente Vídeo (Mudo)</span>
                            </button>
                            {(item.media.platform === 'twitter' || item.media.platform === 'youtube') && (
                              <button
                                type="button"
                                className={`ys-format-pill ${item.format === 'gif' ? 'is-active' : ''}`}
                                onClick={() => handleFormatChange(item.id, 'gif')}
                                disabled={item.status === 'downloading' || item.status === 'preparing_sticker'}
                              >
                                <Sparkles size={14} />
                                <span>GIF Animado</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Seletor de Perfil (apenas para vídeo) */}
                        {(item.format === 'video_muxed' || item.format === 'video_only') && (
                          <div className="ys-setting-group">
                            <div className="ys-setting-label-row">
                              <span className="ys-setting-label">Perfil de Compatibilidade:</span>
                              {item.profile === 'compatibility' && (
                                <span className="ys-pill-badge-recommended">
                                  <ShieldCheck size={12} /> Compatibilidade Total
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
                                  <span className="ys-profile-name">{prof.name}</span>
                                  {prof.isRecommended && <span className="ys-badge-tag">Padrão</span>}
                                </button>
                              ))}
                            </div>

                            {/* Alerta caso escolha perfil de estúdio */}
                            {item.profile === 'studio_max' && (
                              <div className="ys-profile-warning">
                                <AlertTriangle size={14} />
                                <span>
                                  Atenção: O formato de estúdio (MKV / AV1) não é compatível com WhatsApp e pode travar em reprodutores convencionais.
                                </span>
                              </div>
                            )}

                            {/* Informação sobre Máxima Compatibilidade */}
                            {item.profile === 'compatibility' && (
                              <div className="ys-profile-info">
                                <Info size={14} />
                                <span>
                                  Codificado em MP4 H.264 + AAC com faststart. Funciona com 100% de sucesso em celulares, grupos de WhatsApp e computadores.
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Progress Bar (se estiver baixando) */}
                    {item.status === 'downloading' && (
                      <div className="ys-card-progress-bar">
                        <div className="ys-progress-track">
                          <div
                            className="ys-progress-fill"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <div className="ys-progress-info">
                          <span>Transferindo stream e preparando arquivo...</span>
                          <strong>{item.progress}%</strong>
                        </div>
                      </div>
                    )}

                    {/* Error Banner isolado */}
                    {item.status === 'error' && (
                      <div className="ys-card-error-banner">
                        <span>{item.errorMessage || 'Falha ao processar.'}</span>
                        <Button
                          className="p-button-outlined p-button-sm ys-retry-btn"
                          onClick={() => handleStartDownload(item.id)}
                        >
                          <RefreshCw size={14} />
                          <span>Tentar de Novo</span>
                        </Button>
                      </div>
                    )}

                    {/* Completed Banner */}
                    {item.status === 'completed' && (
                      <div className="ys-card-success-banner">
                        <CheckCircle2 size={18} color="#10B981" />
                        <span>Arquivo baixado e salvo no seu computador!</span>
                      </div>
                    )}

                    {/* Card Actions com Espaçamento Amplo */}
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
                              <span>Baixando ({item.progress}%)...</span>
                            </>
                          ) : (
                            <>
                              <Download size={16} />
                              <span>Baixar Arquivo</span>
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
                              <span>Preparando Figurinha...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles size={16} />
                              <span>Fazer Figurinha WhatsApp</span>
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

