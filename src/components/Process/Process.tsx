import React from 'react';
import { useTranslation } from 'react-i18next';
import { Compass, PenTool, Hammer, Activity } from 'lucide-react';
import './Process.scss';

const PHASES = [
  { icon: Compass, phase: '01' },
  { icon: PenTool, phase: '02' },
  { icon: Hammer, phase: '03' },
  { icon: Activity, phase: '04' }
];

export const Process: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="ys-process ys-section" id="process" aria-label="Processo de engenharia">
      <div className="container">
        <div className="ys-process-head">
          <span className="ys-eyebrow">{t('process.eyebrow')}</span>
          <h2 className="ys-section-title">
            {t('process.title')}<span className="gradient-text-gold">{t('process.title_highlight')}</span>{t('process.title_suffix')}
          </h2>
          <p className="ys-section-subtitle">
            {t('process.subtitle')}
          </p>
        </div>

        <div className="ys-process-track" role="list">
          {PHASES.map((p, i) => {
            const Icon = p.icon;
            return (
              <div className="ys-process-step" role="listitem" key={p.phase}>
                <div className="ys-process-step-rail" aria-hidden="true">
                  <div className="ys-process-step-dot">
                    <Icon size={16} strokeWidth={2.25} />
                  </div>
                  {i < PHASES.length - 1 && <div className="ys-process-step-line" />}
                </div>

                <div className="ys-process-step-card">
                  <div className="ys-process-step-head">
                    <span className="ys-process-step-phase font-code">{p.phase}</span>
                    <h3 className="ys-process-step-title">{t(`process.phases.${i}.title`)}</h3>
                    <span className="ys-process-step-duration">{t(`process.phases.${i}.duration`)}</span>
                  </div>
                  <p className="ys-process-step-desc">{t(`process.phases.${i}.desc`)}</p>
                  <ul className="ys-process-step-deliverables">
                    <li>{t(`process.phases.${i}.deliverables.0`)}</li>
                    <li>{t(`process.phases.${i}.deliverables.1`)}</li>
                    <li>{t(`process.phases.${i}.deliverables.2`)}</li>
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
