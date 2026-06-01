import React from 'react';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Activity } from 'lucide-react';
import { scrollToSection } from '../../utils/scrollToSection';
import { trackEvent } from '../../utils/analytics';
import './Hero.scss';

export const Hero: React.FC = () => {
  const { t } = useTranslation();

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
            {t('hero.status')}
          </span>
        </div>

        <h1 className="ys-hero-title">
          <span className="gradient-text">{t('hero.title_1')}</span><br />
          {t('hero.title_2')}
        </h1>

        <p className="ys-hero-subtitle">
          {t('hero.subtitle')}
        </p>

        <div className="ys-hero-actions">
          <Button
            className="p-button-primary ys-btn-primary"
            onClick={handlePrimary}
          >
            <span>{t('hero.cta_primary')}</span>
            <ArrowRight size={16} strokeWidth={2.5} />
          </Button>
          <Button
            label={t('hero.cta_secondary')}
            className="p-button-outlined ys-btn-outline"
            onClick={handleSecondary}
          />
        </div>

        <div className="ys-hero-trustline">
          <span className="ys-trustline-label">{t('hero.trustline_label')}</span>
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
          <span className="ys-metric-val">{t('hero.metric_1_val')}</span>
          <span className="ys-metric-label">{t('hero.metric_1_label')}</span>
        </div>
        <div className="ys-metric-divider" />
        <div className="ys-metric">
          <span className="ys-metric-val">{t('hero.metric_2_val')}</span>
          <span className="ys-metric-label">{t('hero.metric_2_label')}</span>
        </div>
        <div className="ys-metric-divider" />
        <div className="ys-metric">
          <span className="ys-metric-val">{t('hero.metric_3_val')}</span>
          <span className="ys-metric-label">{t('hero.metric_3_label')}</span>
        </div>
        <div className="ys-metric-divider" />
        <div className="ys-metric">
          <span className="ys-metric-val">{t('hero.metric_4_val')}</span>
          <span className="ys-metric-label">{t('hero.metric_4_label')}</span>
        </div>
      </div>
    </section>
  );
};
