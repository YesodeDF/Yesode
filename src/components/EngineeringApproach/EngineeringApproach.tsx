import React from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Users, Target } from 'lucide-react';
import './EngineeringApproach.scss';

const STATS = [
  { icon: Zap },
  { icon: Target },
  { icon: Users }
];

export const EngineeringApproach: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="ys-approach ys-section" id="approach">
      <div className="container">
        <div className="ys-approach-grid">
          <div className="ys-approach-content">
            <span className="ys-eyebrow">{t('approach.eyebrow')}</span>
            <h2 className="ys-section-title">
              {t('approach.title')}<span className="gradient-text-gold">{t('approach.title_highlight')}</span>{t('approach.title_suffix')}
            </h2>
            <p className="ys-approach-text">
              {t('approach.text_1')}
            </p>
            <p className="ys-approach-text ys-approach-text--muted">
              {t('approach.text_2')}
            </p>

            <div className="ys-approach-quote">
              <div className="ys-approach-quote-bar" aria-hidden="true" />
              <div className="ys-approach-quote-body">
                <span className="ys-approach-quote-tag">{t('approach.quote_tag')}</span>
                <p>
                  {t('approach.quote_text')}
                </p>
              </div>
            </div>
          </div>

          <div className="ys-approach-stats">
            {STATS.map((s, index) => {
              const Icon = s.icon;
              return (
                <div key={index} className="ys-approach-stat">
                  <div className="ys-approach-stat-icon">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <div className="ys-approach-stat-body">
                    <div className="ys-approach-stat-value">{t(`approach.stats.${index}.value`)}</div>
                    <div className="ys-approach-stat-label">{t(`approach.stats.${index}.label`)}</div>
                    <div className="ys-approach-stat-desc">{t(`approach.stats.${index}.desc`)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
