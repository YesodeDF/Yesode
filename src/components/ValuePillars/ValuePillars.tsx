import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Sparkles, Code2, Cpu, GitBranch, ShieldCheck } from 'lucide-react';
import './ValuePillars.scss';

const PILLARS = [
  { icon: Search, size: 'lg' },
  { icon: Sparkles, size: 'sm' },
  { icon: Code2, size: 'sm' },
  { icon: Cpu, size: 'md' },
  { icon: GitBranch, size: 'md' },
  { icon: ShieldCheck, size: 'md' }
];

export const ValuePillars: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="ys-pillars ys-section" id="pillars">
      <div className="ys-grid-bg" />
      <div className="container">
        <div className="ys-pillars-head">
          <span className="ys-eyebrow">{t('pillars.eyebrow')}</span>
          <h2 className="ys-section-title">
            {t('pillars.title')}<span className="gradient-text-gold">{t('pillars.title_highlight')}</span>{t('pillars.title_suffix')}
          </h2>
          <p className="ys-section-subtitle">
            {t('pillars.subtitle')}
          </p>
        </div>

        <div className="ys-pillars-grid">
          {PILLARS.map((p, index) => {
            const Icon = p.icon;
            return (
              <article key={index} className={`ys-pillar ys-pillar--${p.size}`}>
                <div className="ys-pillar-icon">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <div className="ys-pillar-tag">{t(`pillars.items.${index}.tag`)}</div>
                <h3 className="ys-pillar-title">{t(`pillars.items.${index}.title`)}</h3>
                <p className="ys-pillar-desc">{t(`pillars.items.${index}.desc`)}</p>
                <div className="ys-pillar-glow" aria-hidden="true" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
