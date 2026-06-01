import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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

export default App;
