import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingDown, Zap, Layers } from 'lucide-react';
import './Cases.scss';

const CASES = [
  { kpi: '-62%', icon: TrendingDown },
  { kpi: '6.6×', icon: Zap },
  { kpi: '-93%', icon: Layers }
];

export const Cases: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="ys-cases ys-section" id="cases" aria-label="Cases de engenharia">
      <div className="container">
        <div className="ys-cases-head">
          <span className="ys-eyebrow">{t('cases.eyebrow')}</span>
          <h2 className="ys-section-title">
            {t('cases.title')}<span className="gradient-text-gold">{t('cases.title_highlight')}</span>
          </h2>
          <p className="ys-section-subtitle">
            {t('cases.subtitle')}
          </p>
        </div>

        <div className="ys-cases-grid">
          {CASES.map((c, index) => {
            const Icon = c.icon;
            return (
              <article key={index} className="ys-case">
                <div className="ys-case-head">
                  <span className="ys-case-industry">{t(`cases.items.${index}.industry`)}</span>
                  <span className="ys-case-badge">{t(`cases.items.${index}.badge`)}</span>
                </div>

                <h3 className="ys-case-title">{t(`cases.items.${index}.title`)}</h3>

                <div className="ys-case-kpi">
                  <div className="ys-case-kpi-icon">
                    <Icon size={18} strokeWidth={2.25} />
                  </div>
                  <div className="ys-case-kpi-body">
                    <div className="ys-case-kpi-value">{c.kpi}</div>
                    <div className="ys-case-kpi-label">{t(`cases.items.${index}.kpiLabel`)}</div>
                  </div>
                </div>

                <dl className="ys-case-delta">
                  <div className="ys-case-delta-row">
                    <dt>{t('cases.before')}</dt>
                    <dd>{t(`cases.items.${index}.before`)}</dd>
                  </div>
                  <div className="ys-case-delta-row ys-case-delta-row--after">
                    <dt>{t('cases.after')}</dt>
                    <dd>{t(`cases.items.${index}.after`)}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
