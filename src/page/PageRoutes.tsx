import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
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
import '@shared/styles/global.scss';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <SocialProof />
      <ValuePillars />
      <Cases />
      <EngineeringApproach />
      <Process />
      <ProofOfEngineering />
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
  return 'en';
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

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    const title = i18n.t('seo.title');
    const description = i18n.t('seo.description');
    if (title) document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && description) {
      metaDesc.setAttribute('content', description);
    }
  }, [i18n.language, i18n]);

  if (!lang || !['en', 'pt', 'es'].includes(lang)) {
    return null;
  }

  return (
    <>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
          <Route path="/termos-de-uso" element={<TermsOfUse />} />
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
