import React from 'react';
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
import './styles/global.scss';

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
  // 1. Saved choice
  const saved = localStorage.getItem('i18nextLng');
  if (saved && ['en', 'pt', 'es'].includes(saved)) {
    return saved;
  }
  // 2. Browser language
  const browserLang = navigator.language.split('-')[0];
  if (['en', 'pt', 'es'].includes(browserLang)) {
    return browserLang;
  }
  // 3. Fallback
  return 'en';
};

const LanguageLayout: React.FC = () => {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();

  React.useEffect(() => {
    if (!lang || !['en', 'pt', 'es'].includes(lang)) {
      // Invalid language prefix, detect and redirect
      const detected = detectLanguage();
      const cleanPath = location.pathname;
      navigate(`/${detected}${cleanPath}${location.search}${location.hash}`, { replace: true });
    } else {
      // Valid language, update i18n
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
      // Save choice
      localStorage.setItem('i18nextLng', lang);
    }
  }, [lang, i18n, location.pathname, location.search, location.hash, navigate]);

  React.useEffect(() => {
    // Update HTML lang attribute
    document.documentElement.lang = i18n.language;
    // Update SEO title and description dynamically
    const title = i18n.t('seo.title');
    const description = i18n.t('seo.description');
    if (title) document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && description) {
      metaDesc.setAttribute('content', description);
    }
  }, [i18n.language, i18n]);

  if (!lang || !['en', 'pt', 'es'].includes(lang)) {
    return null; // Will redirect in useEffect
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

const App: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
    }
  }, [location.pathname, location.hash]);

  return (
    <Routes>
      <Route path="/:lang/*" element={<LanguageLayout />} />
      <Route path="*" element={<LanguageLayout />} />
    </Routes>
  );
};

export default App;
