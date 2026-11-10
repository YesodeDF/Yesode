import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { QrCode, Video, Smile, ShieldCheck, Sparkles, Terminal } from 'lucide-react';
import { QrGeneratorWorkspace } from '@/modules/qr-generator/presentation/components/QrGeneratorWorkspace.tsx';
import { MediaDownloaderWorkspace } from '@/modules/media-downloader/presentation/components/MediaDownloaderWorkspace.tsx';
import { WhatsAppStickerWorkspace } from '@/modules/whatsapp-sticker/presentation/components/WhatsAppStickerWorkspace.tsx';
import { SeoHead } from '@/shared/components/SeoHead.tsx';
import './FreeToolsPage.scss';

export type ToolTab = 'qr' | 'media' | 'sticker';

export const FreeToolsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang = 'pt' } = useParams<{ lang: string }>();

  // Sincroniza a aba ativa com a URL semântica para indexação no Google
  const getTabFromPath = (): ToolTab => {
    if (location.pathname.includes('gerador-qr-code-pix')) return 'qr';
    if (location.pathname.includes('baixar-videos')) return 'media';
    if (location.pathname.includes('criar-figurinha-whatsapp')) return 'sticker';
    return 'qr';
  };

  const [activeTab, setActiveTab] = useState<ToolTab>(getTabFromPath);
  const [prefilledVideoForSticker, setPrefilledVideoForSticker] = useState<string>('');

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const handleTabChange = (tab: ToolTab) => {
    setActiveTab(tab);
    if (tab === 'qr') navigate(`/${lang}/ferramentas/gerador-qr-code-pix`);
    else if (tab === 'media') navigate(`/${lang}/ferramentas/baixar-videos-youtube-redes-sociais`);
    else if (tab === 'sticker') navigate(`/${lang}/ferramentas/criar-figurinha-whatsapp`);
  };

  const handleSendToSticker = (videoUrl: string) => {
    setPrefilledVideoForSticker(videoUrl);
    handleTabChange('sticker');
  };

  // SEO & JSON-LD Dinâmico para busca número 1 no Google e citação por LLMs
  const seoData = {
    qr: {
      title: 'Gerador de QR Code Pix e Links Grátis — Oficial EMV® e CRC16 | Yesode',
      description: 'Crie QR Codes Pix estáticos oficiais com validação CRC16, decodificador Pix Copia e Cola e QR Codes para links. 100% grátis, sem cadastro e sem anúncios.',
      keywords: ['gerador de qrcode pix', 'pix copia e cola', 'qr code pix emv', 'gerar qr code gratis', 'criar qrcode sem anuncio', 'qr code png alta resolucao'],
      canonical: `https://yesode.com/${lang}/ferramentas/gerador-qr-code-pix`,
      schema: {
        '@type': 'WebApplication',
        name: 'Yesode Gerador de QR Code e Cobrança Pix Oficial',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'BRL',
        },
        description: 'Gerador normativo de pagamentos Pix padrão Banco Central e gerador de QR Code de links.',
      },
    },
    media: {
      title: 'Baixar Vídeos e Áudios do YouTube, X, Instagram e Facebook Grátis | Yesode',
      description: 'Baixe vídeos em até 4K e áudios MP3 320kbps do YouTube, X/Twitter, Instagram Reels e Facebook sem anúncios, sem vírus e com alta velocidade.',
      keywords: ['baixar video do youtube', 'yt downloader gratis', 'baixar video do twitter x', 'download reels instagram', 'baixar video facebook', 'youtube mp3 320k'],
      canonical: `https://yesode.com/${lang}/ferramentas/baixar-videos-youtube-redes-sociais`,
      schema: {
        '@type': 'WebApplication',
        name: 'Yesode Downloader de Mídias e Redes Sociais',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'BRL',
        },
        description: 'Extrator de vídeos em alta resolução e áudios para YouTube, X, Instagram e Facebook.',
      },
    },
    sticker: {
      title: 'Criar Figurinhas WhatsApp de Vídeo e GIF Online (WebP 512x512) | Yesode',
      description: 'Transforme trechos de vídeos e GIFs em figurinhas animadas para WhatsApp no padrão oficial 512x512 WebP e limite de 500KB. Rápido e gratuito.',
      keywords: ['criar figurinha whatsapp', 'video para sticker whatsapp', 'gif para figurinha animada', 'sticker 512x512 webp', 'fazer figurinha online'],
      canonical: `https://yesode.com/${lang}/ferramentas/criar-figurinha-whatsapp`,
      schema: {
        '@type': 'WebApplication',
        name: 'Yesode WhatsApp Sticker Studio',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'BRL',
        },
        description: 'Conversor de vídeos e GIFs para figurinhas animadas do WhatsApp em formato WebP 512x512.',
      },
    },
  }[activeTab];

  return (
    <div className="ys-free-tools-page">
      <SeoHead
        title={seoData.title}
        description={seoData.description}
        canonicalUrl={seoData.canonical}
        keywords={seoData.keywords}
        jsonLd={[
          seoData.schema,
          {
            '@type': 'Organization',
            name: 'Yesode',
            url: 'https://yesode.com',
            logo: 'https://yesode.com/logo.svg',
            sameAs: ['https://github.com/YesodeDF', 'https://www.linkedin.com/company/yesode'],
          },
        ]}
      />

      <div className="container">
        {/* Page Hero */}
        <div className="ys-tools-hero">
          <div className="ys-tools-badge">
            <Sparkles size={14} />
            <span>Yesode Labs — Ferramentas Gratuitas</span>
          </div>
          <h1 className="ys-tools-headline">
            Engenharia de Alta Performance. <br />
            <span className="gradient-text-gold">100% Grátis & Sem Anúncios.</span>
          </h1>
          <p className="ys-tools-description">
            Utilitários essenciais construídos com a mesma arquitetura crítica que entregamos para nossos clientes corporativos.
            Zero pop-ups, zero cadastros obrigatórios e total privacidade dos seus dados.
          </p>

          <div className="ys-tools-banner-desktop">
            <Terminal size={16} />
            <span>
              <strong>Em Breve:</strong> Aplicativos Desktop nativos (Windows, macOS e Linux) para download direto e bypass offline.
            </span>
          </div>
        </div>

        {/* Tools Navigator */}
        <div className="ys-tools-nav-bar">
          <button
            type="button"
            className={`ys-tool-tab ${activeTab === 'qr' ? 'is-active' : ''}`}
            onClick={() => handleTabChange('qr')}
          >
            <QrCode size={18} />
            <div className="ys-tool-tab-info">
              <span className="ys-tool-tab-name">Gerador QR Code & Pix</span>
              <span className="ys-tool-tab-sub">EMV®, CRC16 e Links</span>
            </div>
          </button>

          <button
            type="button"
            className={`ys-tool-tab ${activeTab === 'media' ? 'is-active' : ''}`}
            onClick={() => handleTabChange('media')}
          >
            <Video size={18} />
            <div className="ys-tool-tab-info">
              <span className="ys-tool-tab-name">Downloader de Mídia</span>
              <span className="ys-tool-tab-sub">YouTube, X, Insta e Facebook</span>
            </div>
          </button>

          <button
            type="button"
            className={`ys-tool-tab ${activeTab === 'sticker' ? 'is-active' : ''}`}
            onClick={() => handleTabChange('sticker')}
          >
            <Smile size={18} />
            <div className="ys-tool-tab-info">
              <span className="ys-tool-tab-name">Figurinhas WhatsApp</span>
              <span className="ys-tool-tab-sub">Vídeos/GIFs para WebP 512x512</span>
            </div>
          </button>
        </div>

        {/* Active Workspace */}
        <div className="ys-tool-workspace-container">
          {activeTab === 'qr' && <QrGeneratorWorkspace />}
          {activeTab === 'media' && (
            <MediaDownloaderWorkspace onSendToStickerMaker={handleSendToSticker} />
          )}
          {activeTab === 'sticker' && (
            <WhatsAppStickerWorkspace initialVideoUrl={prefilledVideoForSticker} />
          )}
        </div>

        {/* Security & Architecture Guarantees */}
        <div className="ys-tools-trust-section">
          <div className="ys-trust-item">
            <ShieldCheck size={20} className="ys-trust-icon" />
            <div>
              <h5>Privacidade Absoluta</h5>
              <p>Processamento local direto na memória do seu navegador. Não guardamos senhas, links ou dados bancários.</p>
            </div>
          </div>
          <div className="ys-trust-item">
            <Sparkles size={20} className="ys-trust-icon" />
            <div>
              <h5>Sem Monetização Oculta</h5>
              <p>Sem banners do Google Ads, sem rastreadores abusivos e sem tempo de espera artificial.</p>
            </div>
          </div>
          <div className="ys-trust-item">
            <Terminal size={20} className="ys-trust-icon" />
            <div>
              <h5>Código Aberto & DDD</h5>
              <p>Modelado seguindo os princípios de Domínios Ricos e Engenharia de Software de ponta da Yesode.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

