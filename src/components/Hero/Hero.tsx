import React from 'react';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import './Hero.scss';

export const Hero: React.FC = () => {
  return (
    <section className="ys-hero">
      <div className="ys-hero-grid"></div>
      <div className="ys-hero-glow"></div>
      
      <div className="container ys-hero-content">
        <div className="ys-hero-badge">
          <Chip label="System Online: Yesode V1.0.0" className="ys-chip" icon="pi pi-check-circle" />
        </div>
        
        <h1 className="ys-hero-title">
          Construímos arquitetura,<br/>
          não <span>templates.</span>
        </h1>
        <p className="ys-hero-subtitle">
          Projetamos software sob medida para operações corporativas críticas.<br />
          Trazemos a estabilidade da engenharia de ponta para o seu negócio.
        </p>
        
        <div className="ys-hero-actions">
          <Button label="Agendar Consultoria Gratuita" className="p-button-primary p-button-lg ys-btn-primary" />
          <Button label="Explorar Arquitetura" className="p-button-outlined p-button-secondary p-button-lg ys-btn-outline" />
        </div>
      </div>

      <div className="ys-hero-metrics">
        <div className="ys-metric"><span className="ys-metric-val">99.99%</span><span className="ys-metric-label">Uptime SLA</span></div>
        <div className="ys-metric-divider"></div>
        <div className="ys-metric"><span className="ys-metric-val">&lt; 20ms</span><span className="ys-metric-label">Latency Edge</span></div>
        <div className="ys-metric-divider"></div>
        <div className="ys-metric"><span className="ys-metric-val">Global</span><span className="ys-metric-label">Mesh Network</span></div>
        <div className="ys-metric-divider"></div>
        <div className="ys-metric"><span className="ys-metric-val">Zero</span><span className="ys-metric-label">Vendor Lock-in</span></div>
      </div>
    </section>
  );
};
