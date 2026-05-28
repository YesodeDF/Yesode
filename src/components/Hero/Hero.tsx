import React from 'react';
import { Button } from 'primereact/button';
import { ArrowRight, Activity } from 'lucide-react';
import { scrollToSection } from '../../utils/scrollToSection';
import { trackEvent } from '../../utils/analytics';
import './Hero.scss';

export const Hero: React.FC = () => {
  const handlePrimary = () => {
    trackEvent('cta_hero_primary_click');
    scrollToSection('contact');
  };
  const handleSecondary = () => {
    trackEvent('cta_hero_secondary_click', { target: 'cases' });
    scrollToSection('cases');
  };
  return (
    <section className="ys-hero">
      <div className="ys-grid-bg" />
      <div className="ys-orb ys-orb--gold" />
      <div className="ys-orb ys-orb--violet" />

      <div className="container ys-hero-content">
        <div className="ys-hero-status">
          <span className="ys-status-dot">
            <span className="ys-status-dot-pulse" />
          </span>
          <span className="ys-status-text">
            <Activity size={12} strokeWidth={2.5} />
            System Online — Yesode V1.0.0
          </span>
        </div>

        <h1 className="ys-hero-title">
          <span className="gradient-text">Construímos arquitetura,</span><br />
          não <span className="gradient-text-gold">templates.</span>
        </h1>

        <p className="ys-hero-subtitle">
          Projetamos software sob medida para operações corporativas críticas.
          Trazemos a estabilidade da engenharia de ponta para o seu negócio.
        </p>

        <div className="ys-hero-actions">
          <Button
            className="p-button-primary ys-btn-primary"
            onClick={handlePrimary}
          >
            <span>Agendar Consultoria Gratuita</span>
            <ArrowRight size={16} strokeWidth={2.5} />
          </Button>
          <Button
            label="Ver Cases →"
            className="p-button-outlined ys-btn-outline"
            onClick={handleSecondary}
          />
        </div>

        <div className="ys-hero-trustline">
          <span className="ys-trustline-label">Stack</span>
          <span className="ys-trustline-items">
            <span>TypeScript</span><span>·</span>
            <span>Go</span><span>·</span>
            <span>Rust</span><span>·</span>
            <span>Kubernetes</span><span>·</span>
            <span>PostgreSQL</span><span>·</span>
            <span>AWS</span>
          </span>
        </div>
      </div>

      <div className="ys-hero-metrics">
        <div className="ys-metric">
          <span className="ys-metric-val">99.99<small>%</small></span>
          <span className="ys-metric-label">Uptime SLA</span>
        </div>
        <div className="ys-metric-divider" />
        <div className="ys-metric">
          <span className="ys-metric-val">&lt; 20<small>ms</small></span>
          <span className="ys-metric-label">Edge Latency</span>
        </div>
        <div className="ys-metric-divider" />
        <div className="ys-metric">
          <span className="ys-metric-val">Global</span>
          <span className="ys-metric-label">Mesh Network</span>
        </div>
        <div className="ys-metric-divider" />
        <div className="ys-metric">
          <span className="ys-metric-val">Zero</span>
          <span className="ys-metric-label">Vendor Lock-in</span>
        </div>
      </div>
    </section>
  );
};
