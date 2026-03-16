import React from 'react';
import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { ProofOfEngineering } from './components/ProofOfEngineering/ProofOfEngineering';
import { ValuePillars } from './components/ValuePillars/ValuePillars';
import { EngineeringApproach } from './components/EngineeringApproach/EngineeringApproach';
import { LeadCapture } from './components/LeadCapture/LeadCapture';
import { Footer } from './components/Footer/Footer';
import './styles/global.scss';

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Hero />
      <ProofOfEngineering />
      <ValuePillars />
      <EngineeringApproach />
      <LeadCapture />
      <Footer />
    </>
  );
};

export default App;
