import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import {
  Download,
  Video,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Loader2,
  Plus,
  RefreshCw,
  X
} from 'lucide-react';
import { MediaSourceUrl } from '../../domain/value-objects/MediaSourceUrl.ts';
import './MediaDownloaderWorkspace.scss';

export interface QueueItem {
  id: string;
  rawUrl: string;
  media: MediaSourceUrl | null;
  status: 'idle' | 'analyzing' | 'ready' | 'downloading' | 'preparing_sticker' | 'completed' | 'error';
  progress: number;
  format: 'video' | 'audio' | 'gif';
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

      return {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        rawUrl: url,
        media,
        status,
        progress: 0,
        format: 'video',
        errorMessage,
      };
    });

    setQueue((prev) => [...prev, ...newItems]);
    setInputText('');
  };

  // Alterar formato de um item específico na fila
  const handleFormatChange = (id: string, format: 'video' | 'audio' | 'gif') => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, format } : item))
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
      prev.map((q) => (q.id === id ? { ...q, status: 'downloading', progress: 10, errorMessage: undefined } : q))
    );

    try {
      // Simulação do progresso gradual do stream (0% -> 100%)
      const interval = setInterval(() => {
        setQueue((prev) =>
          prev.map((q) => {
            if (q.id === id && q.status === 'downloading' && q.progress < 90) {
              return { ...q, progress: q.progress + 20 };
            }
            return q;
          })
        );
      }, 300);

      // Chamada real para extração / proxy de download
      const response = await fetch(`/api/tools/media-download?url=${encodeURIComponent(item.media.url)}&format=${item.format}`);
      clearInterval(interval);

      if (!response.ok) {
        throw new Error('Falha no servidor ao processar o vídeo. Tente novamente.');
      }

      const blob = await response.blob();
      const extension = item.format === 'audio' ? 'mp3' : item.format === 'gif' ? 'gif' : 'mp4';
      const filename = `yesode-${item.media.platform}-${Date.now()}.${extension}`;

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
      // Falha isolada somente neste card
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
      // Cria buffer/blob local de vídeo utilizável
      let videoBlobUrl = item.blobUrl;
      if (!videoBlobUrl) {
        // Gera um blob de vídeo para o player
        const resp = await fetch(`/api/tools/media-download?url=${encodeURIComponent(item.media.url)}&format=video`);
        const blob = await resp.blob();
        videoBlobUrl = window.URL.createObjectURL(blob);
      }

      setQueue((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: 'ready' } : q))
      );

      // Transita para o sticker studio com o blob pronto
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
              Extração sem anúncios, sem limite e com salvamento direto na sua máquina. Cole <strong>um ou vários links</strong> do YouTube, X, Instagram ou Facebook.
            </p>
          </div>

          {/* Form para adicionar 1 ou múltiplos links */}
          <form className="ys-multi-input-form" onSubmit={handleAddLinks}>
            <div className="ys-multi-input-wrapper">
              <textarea
                rows={2}
                value={inputText}
                placeholder="Cole um ou mais links aqui (um por linha)...&#10;Ex: https://youtube.com/watch?v=...&#10;https://x.com/user/status/..."
                className="ys-multi-textarea"
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
            <Button type="submit" className="p-button-primary ys-add-queue-btn">
              <Plus size={16} />
              <span>Adicionar à Fila</span>
            </Button>
          </form>

          {/* Supported platform chips */}
          <div className="ys-platform-chips">
            <span className="ys-chip">YouTube (4K e MP3)</span>
            <span className="ys-chip">X / Twitter (Vídeos e GIFs)</span>
            <span className="ys-chip">Instagram (Reels e Posts)</span>
            <span className="ys-chip">Facebook Watch</span>
          </div>

          {/* Fila Assíncrona de Downloads */}
          {queue.length > 0 && (
            <div className="ys-queue-container">
              <div className="ys-queue-header">
                <h4>Fila de Mídias ({queue.length})</h4>
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
                    <div className="ys-card-top-row">
                      <div className="ys-card-meta">
                        <Video size={18} className="ys-meta-icon" />
                        <div className="ys-meta-text">
                          <span className="ys-platform-label">
                            {item.media ? item.media.platformDisplayName : 'Link Desconhecido'}
                          </span>
                          <span className="ys-url-preview" title={item.rawUrl}>
                            {item.rawUrl}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="ys-remove-btn"
                        onClick={() => handleRemoveItem(item.id)}
                        title="Remover da fila"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Format Selector */}
                    {item.media && item.status !== 'completed' && (
                      <div className="ys-card-formats">
                        <button
                          type="button"
                          className={`ys-format-pill ${item.format === 'video' ? 'is-active' : ''}`}
                          onClick={() => handleFormatChange(item.id, 'video')}
                          disabled={item.status === 'downloading' || item.status === 'preparing_sticker'}
                        >
                          Vídeo MP4
                        </button>
                        <button
                          type="button"
                          className={`ys-format-pill ${item.format === 'audio' ? 'is-active' : ''}`}
                          onClick={() => handleFormatChange(item.id, 'audio')}
                          disabled={item.status === 'downloading' || item.status === 'preparing_sticker'}
                        >
                          Áudio MP3 (320k)
                        </button>
                        {(item.media.platform === 'twitter' || item.media.platform === 'youtube') && (
                          <button
                            type="button"
                            className={`ys-format-pill ${item.format === 'gif' ? 'is-active' : ''}`}
                            onClick={() => handleFormatChange(item.id, 'gif')}
                            disabled={item.status === 'downloading' || item.status === 'preparing_sticker'}
                          >
                            GIF Animado
                          </button>
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
                          <span>Transferindo stream para seu computador...</span>
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
                          <RefreshCw size={13} />
                          <span>Tentar de Novo</span>
                        </Button>
                      </div>
                    )}

                    {/* Completed Banner */}
                    {item.status === 'completed' && (
                      <div className="ys-card-success-banner">
                        <CheckCircle2 size={16} color="#10B981" />
                        <span>Arquivo baixado e salvo no seu computador!</span>
                      </div>
                    )}

                    {/* Card Actions */}
                    <div className="ys-card-actions">
                      {item.status !== 'completed' && item.status !== 'error' && (
                        <Button
                          className="p-button-primary p-button-sm ys-start-download-btn"
                          disabled={item.status === 'downloading' || item.status === 'preparing_sticker'}
                          onClick={() => handleStartDownload(item.id)}
                        >
                          {item.status === 'downloading' ? (
                            <>
                              <Loader2 size={15} className="ys-spin" />
                              <span>Baixando ({item.progress}%)...</span>
                            </>
                          ) : (
                            <>
                              <Download size={15} />
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
                              <Loader2 size={15} className="ys-spin" />
                              <span>Preparando Figurinha...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles size={15} />
                              <span>Fazer Figurinha WhatsApp</span>
                              <ArrowRight size={13} />
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
