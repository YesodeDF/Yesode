import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { QrCode, Video, Smile, ShieldCheck, Sparkles, Terminal, HelpCircle, ListChecks } from 'lucide-react';
import { QrGeneratorWorkspace } from '@/modules/qr-generator/presentation/components/QrGeneratorWorkspace.tsx';
import { MediaDownloaderWorkspace } from '@/modules/media-downloader/presentation/components/MediaDownloaderWorkspace.tsx';
import { WhatsAppStickerWorkspace } from '@/modules/whatsapp-sticker/presentation/components/WhatsAppStickerWorkspace.tsx';
import { SeoHead } from '@/shared/components/SeoHead.tsx';
import {
  BASE_URL,
  getTabFromPathname,
  getToolAlternates,
  getToolPath,
  normalizeLang,
  type ToolTab,
} from '@/modules/landing/domain/ToolRoutes.ts';
import './FreeToolsPage.scss';

export type { ToolTab };

interface GuideStep {
  name: string;
  text: string;
}

interface GuideFaq {
  q: string;
  a: string;
}

export const FreeToolsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang = normalizeLang(rawLang);
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<ToolTab>(() => getTabFromPathname(location.pathname));
  const [prefilledVideoForSticker, setPrefilledVideoForSticker] = useState<string>('');

  useEffect(() => {
    setActiveTab(getTabFromPathname(location.pathname));
  }, [location.pathname]);

  const handleTabChange = (tab: ToolTab) => {
    setActiveTab(tab);
    navigate(getToolPath(lang, tab));
  };

  const handleSendToSticker = (videoUrl: string) => {
    setPrefilledVideoForSticker(videoUrl);
    handleTabChange('sticker');
  };

  const localeMap: Record<string, string> = {
    pt: 'pt_BR',
    en: 'en_US',
    es: 'es_ES',
  };

  const currencyMap: Record<string, string> = {
    pt: 'BRL',
    en: 'USD',
    es: 'USD',
  };

  const ogImageMap: Record<ToolTab, string> = {
    qr: `${BASE_URL}/og-qr.png`,
    media: `${BASE_URL}/og-media.png`,
    sticker: `${BASE_URL}/og-sticker.png`,
  };

  const steps = t(`tools.guides.${activeTab}.steps`, { returnObjects: true }) as GuideStep[];
  const faqs = t(`tools.guides.${activeTab}.faqs`, { returnObjects: true }) as GuideFaq[];

  const canonical = `${BASE_URL}${getToolPath(lang, activeTab)}`;
  const seoTitle = t(`tools.seo.${activeTab}_title`);
  const seoDesc = t(`tools.seo.${activeTab}_desc`);
  const seoKeywords = t(`tools.seo.${activeTab}_keywords`, { returnObjects: true }) as string[];

  const jsonLd: Record<string, any>[] = [
    {
      '@type': 'WebApplication',
      name: t(`tools.seo.${activeTab}_schema_name`),
      url: canonical,
      inLanguage: lang,
      applicationCategory: activeTab === 'qr' ? 'FinanceApplication' : 'MultimediaApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: currencyMap[lang],
      },
      description: t(`tools.seo.${activeTab}_schema_desc`),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: t('tools.seo.breadcrumb_home'),
          item: `${BASE_URL}/${lang}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: t('tools.seo.breadcrumb_tools'),
          item: `${BASE_URL}${getToolPath(lang)}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: t(`tools.tabs.${activeTab}_name`),
          item: canonical,
        },
      ],
    },
    {
      '@type': 'Organization',
      name: 'Yesode',
      url: BASE_URL,
      logo: `${BASE_URL}/logo.svg`,
      sameAs: ['https://github.com/YesodeDF', 'https://www.linkedin.com/company/yesode'],
    },
  ];

  if (Array.isArray(steps) && steps.length > 0) {
    jsonLd.push({
      '@type': 'HowTo',
      name: seoTitle,
      description: seoDesc,
      inLanguage: lang,
      step: steps.map((s, idx) => ({
        '@type': 'HowToStep',
        position: idx + 1,
        name: s.name,
        text: s.text,
      })),
    });
  }

  if (Array.isArray(faqs) && faqs.length > 0) {
    jsonLd.push({
      '@type': 'FAQPage',
      inLanguage: lang,
      mainEntity: faqs.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    });
  }

  return (
    <div className="ys-free-tools-page">
      <SeoHead
        title={seoTitle}
        description={seoDesc}
        canonicalUrl={canonical}
        keywords={Array.isArray(seoKeywords) ? seoKeywords : []}
        ogImage={ogImageMap[activeTab]}
        locale={localeMap[lang]}
        lang={lang}
        alternates={getToolAlternates(activeTab)}
        jsonLd={jsonLd}
      />

      <div className="container">
        <div className="ys-tools-hero">
          <div className="ys-tools-badge">
            <Sparkles size={14} />
            <span>{t('tools.hero_badge')}</span>
          </div>
          <h1 className="ys-tools-headline">
            {t('tools.hero_title_1')} <br />
            <span className="gradient-text-gold">{t('tools.hero_title_2')}</span>
          </h1>
          <p className="ys-tools-description">{t('tools.hero_desc')}</p>

          <div className="ys-tools-banner-desktop">
            <Terminal size={16} />
            <span>
              <strong>{t('tools.desktop_banner_strong')}</strong> {t('tools.desktop_banner_text')}
            </span>
          </div>
        </div>

        <div className="ys-tools-nav-bar">
          <button
            type="button"
            className={`ys-tool-tab ${activeTab === 'qr' ? 'is-active' : ''}`}
            onClick={() => handleTabChange('qr')}
          >
            <QrCode size={18} />
            <div className="ys-tool-tab-info">
              <span className="ys-tool-tab-name">{t('tools.tabs.qr_name')}</span>
              <span className="ys-tool-tab-sub">{t('tools.tabs.qr_sub')}</span>
            </div>
          </button>

          <button
            type="button"
            className={`ys-tool-tab ${activeTab === 'media' ? 'is-active' : ''}`}
            onClick={() => handleTabChange('media')}
          >
            <Video size={18} />
            <div className="ys-tool-tab-info">
              <span className="ys-tool-tab-name">{t('tools.tabs.media_name')}</span>
              <span className="ys-tool-tab-sub">{t('tools.tabs.media_sub')}</span>
            </div>
          </button>

          <button
            type="button"
            className={`ys-tool-tab ${activeTab === 'sticker' ? 'is-active' : ''}`}
            onClick={() => handleTabChange('sticker')}
          >
            <Smile size={18} />
            <div className="ys-tool-tab-info">
              <span className="ys-tool-tab-name">{t('tools.tabs.sticker_name')}</span>
              <span className="ys-tool-tab-sub">{t('tools.tabs.sticker_sub')}</span>
            </div>
          </button>
        </div>

        <div className="ys-tool-workspace-container">
          {activeTab === 'qr' && <QrGeneratorWorkspace />}
          {activeTab === 'media' && (
            <MediaDownloaderWorkspace onSendToStickerMaker={handleSendToSticker} />
          )}
          {activeTab === 'sticker' && (
            <WhatsAppStickerWorkspace initialVideoUrl={prefilledVideoForSticker} />
          )}
        </div>

        {Array.isArray(steps) && Array.isArray(faqs) && (
          <section className="ys-tools-seo-guides" aria-label={t('tools.guides.howto_title')}>
            <div className="ys-guide-panel">
              <h2 className="ys-guide-heading">
                <ListChecks size={18} />
                <span>{t('tools.guides.howto_title')}</span>
              </h2>
              <ol className="ys-howto-list">
                {steps.map((step, i) => (
                  <li key={i} className="ys-howto-item">
                    <strong>{step.name}</strong>
                    <p>{step.text}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="ys-guide-panel">
              <h2 className="ys-guide-heading">
                <HelpCircle size={18} />
                <span>{t('tools.guides.faq_title')}</span>
              </h2>
              <div className="ys-faq-list">
                {faqs.map((item, i) => (
                  <details key={i} className="ys-faq-item">
                    <summary>{item.q}</summary>
                    <p>{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="ys-tools-trust-section">
          <div className="ys-trust-item">
            <ShieldCheck size={20} className="ys-trust-icon" />
            <div>
              <h5>{t('tools.trust.privacy_title')}</h5>
              <p>{t('tools.trust.privacy_desc')}</p>
            </div>
          </div>
          <div className="ys-trust-item">
            <Sparkles size={20} className="ys-trust-icon" />
            <div>
              <h5>{t('tools.trust.no_ads_title')}</h5>
              <p>{t('tools.trust.no_ads_desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
