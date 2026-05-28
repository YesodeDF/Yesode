import React from 'react';
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
import './styles/global.scss';

const App: React.FC = () => {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <SocialProof />
        <ValuePillars />
        <Cases />
        <EngineeringApproach />
        <Process />
        <ProofOfEngineering />
        <FAQ />
        <LeadCapture />
      </main>
      <Footer />
    </>
  );
};

export default App;
