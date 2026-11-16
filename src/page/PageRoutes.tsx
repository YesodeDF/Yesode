import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { CommercialJourneys } from './components/CommercialJourneys/CommercialJourneys';
import { ProductsShowcase } from './components/ProductsShowcase/ProductsShowcase';
import { SocialProof } from './components/SocialProof/SocialProof';
import { ValuePillars } from './components/ValuePillars/ValuePillars';
import { Cases } from './components/Cases/Cases';
import { EngineeringApproach } from './components/EngineeringApproach/EngineeringApproach';
import { Process } from './components/Process/Process';
import { ProofOfEngineering } from './components/ProofOfEngineering/ProofOfEngineering';
import { FAQ } from './components/FAQ/FAQ';
import { LeadCapture } from './components/LeadCapture/LeadCapture';
import { Footer } from './components/Footer/Footer';
import { PrivacyPolicy } from './pages/Legal/PrivacyPolicy';
import { TermsOfUse } from './pages/Legal/TermsOfUse';
import { EnterprisePage } from './pages/Enterprise/EnterprisePage';
import { BusinessPage } from './pages/Business/BusinessPage';
import { CasesPage } from './pages/Cases/CasesPage';
import { FreeToolsPage } from '@/modules/landing/presentation/pages/FreeToolsPage';
import { SeoHead } from '@/shared/components/SeoHead.tsx';
import {
  BASE_URL,
  getHomeAlternates,
  getLocaleCode,
  normalizeLang,
} from '@/modules/landing/domain/ToolRoutes.ts';
import '@shared/styles/global.scss';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { lang: rawLang = 'pt' } = useParams<{ lang: string }>();
  const lang = normalizeLang(rawLang);
  const canonical = `${BASE_URL}/${lang}`;

  const faqItems = t('faq.items', { returnObjects: true }) as Array<{ q: string; a: string }>;
  const pillarItems = t('pillars.items', { returnObjects: true }) as Array<{
    title: string;
    semantic?: string;
    desc: string;
  }>;
  const seoKeywords = t('seo.keywords', { returnObjects: true }) as string[];

  const jsonLd: Record<string, any>[] = [
    {
      '@type': 'ProfessionalService',
      '@id': `${canonical}#professional-service`,
      name: 'Yesode',
      url: canonical,
      image: `${BASE_URL}/og-cover.png`,
      description: t('seo.description'),
      provider: {
        '@id': `${BASE_URL}/#organization`,
      },
      areaServed: ['BR', 'US', 'EU', 'LATAM'],
      knowsLanguage: ['pt-BR', 'en', 'es'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: t('pillars.eyebrow'),
        itemListElement: Array.isArray(pillarItems)
          ? pillarItems.map((item) => ({
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: item.semantic ? `${item.title} — ${item.semantic}` : item.title,
                description: item.desc,
              },
            }))
          : [],
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: t('tools.seo.breadcrumb_home'),
          item: canonical,
        },
      ],
    },
  ];

  if (Array.isArray(faqItems) && faqItems.length > 0) {
    jsonLd.push({
      '@type': 'FAQPage',
      inLanguage: lang,
      mainEntity: faqItems.map((item) => ({
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
    <>
      <SeoHead
        title={t('seo.title')}
        description={t('seo.description')}
        canonicalUrl={canonical}
        keywords={Array.isArray(seoKeywords) ? seoKeywords : []}
        locale={getLocaleCode(lang)}
        lang={lang}
        alternates={getHomeAlternates()}
        jsonLd={jsonLd}
      />
      <Hero />
      <CommercialJourneys />
      <SocialProof />
      <ValuePillars />
      <Cases />
      <EngineeringApproach />
      <Process />
      <ProofOfEngineering />
      <ProductsShowcase />
      <FAQ />
      <LeadCapture />
    </>
  );
};

const detectLanguage = (): string => {
  const saved = localStorage.getItem('i18nextLng');
  if (saved && ['en', 'pt', 'es'].includes(saved)) {
    return saved;
  }
  const browserLang = navigator.language.split('-')[0];
  if (['en', 'pt', 'es'].includes(browserLang)) {
    return browserLang;
  }
  return 'pt';
};

const LanguageLayout: React.FC = () => {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!lang || !['en', 'pt', 'es'].includes(lang)) {
      const detected = detectLanguage();
      const cleanPath = location.pathname;
      navigate(`/${detected}${cleanPath}${location.search}${location.hash}`, { replace: true });
    } else {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
      localStorage.setItem('i18nextLng', lang);
    }
  }, [lang, i18n, location.pathname, location.search, location.hash, navigate]);

  if (!lang || !['en', 'pt', 'es'].includes(lang)) {
    return null;
  }

  return (
    <>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Strategic Commercial Journeys & Case Studies */}
          <Route path="/enterprise" element={<EnterprisePage />} />
          <Route path="/business" element={<BusinessPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/case-studies" element={<CasesPage />} />
          <Route path="/casos-de-estudio" element={<CasesPage />} />

          {/* Portuguese tools routes */}
          <Route path="/ferramentas" element={<FreeToolsPage />} />
          <Route path="/ferramentas/gerador-qr-code-pix" element={<FreeToolsPage />} />
          <Route path="/ferramentas/baixar-videos-youtube-redes-sociais" element={<FreeToolsPage />} />
          <Route path="/ferramentas/criar-figurinha-whatsapp" element={<FreeToolsPage />} />

          {/* English tools routes + legacy redirects */}
          <Route path="/tools" element={<FreeToolsPage />} />
          <Route path="/tools/qr-code-pix-generator" element={<FreeToolsPage />} />
          <Route path="/tools/youtube-social-video-downloader" element={<FreeToolsPage />} />
          <Route path="/tools/whatsapp-sticker-maker" element={<FreeToolsPage />} />
          <Route path="/tools/media-downloader" element={<Navigate to="/en/tools/youtube-social-video-downloader" replace />} />

          {/* Spanish tools routes */}
          <Route path="/herramientas" element={<FreeToolsPage />} />
          <Route path="/herramientas/generador-codigo-qr-pix" element={<FreeToolsPage />} />
          <Route path="/herramientas/descargar-videos-youtube-redes-sociales" element={<FreeToolsPage />} />
          <Route path="/herramientas/crear-stickers-whatsapp" element={<FreeToolsPage />} />

          {/* Legal routes across languages */}
          <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
          <Route path="/termos-de-uso" element={<TermsOfUse />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/terminos-de-uso" element={<TermsOfUse />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export const PageRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/:lang/*" element={<LanguageLayout />} />
      <Route path="*" element={<LanguageLayout />} />
    </Routes>
  );
};
