import React from 'react';
import { useTranslation } from 'react-i18next';
import { Boxes, Server, Database, BarChart3, ShieldCheck } from 'lucide-react';
import './ProofOfEngineering.scss';

const NODES = [
  { id: 'gateway', icon: ShieldCheck },
  { id: 'core', icon: Boxes, highlight: true },
  { id: 'data', icon: Database },
  { id: 'analytics', icon: BarChart3 }
];

export const ProofOfEngineering: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="ys-proof ys-section" id="proof">
      <div className="container">
        <div className="ys-proof-head">
          <span className="ys-eyebrow">{t('proof.eyebrow')}</span>
          <h2 className="ys-section-title">
            {t('proof.title')}<span className="gradient-text-gold">{t('proof.title_highlight')}</span>{t('proof.title_suffix')}
          </h2>
          <p className="ys-section-subtitle">
            {t('proof.subtitle')}
          </p>
        </div>

        <div className="ys-arch-window font-code" role="img" aria-label="Diagrama de arquitetura Yesode">
          <div className="ys-arch-titlebar">
            <span className="ys-dot ys-dot--red" />
            <span className="ys-dot ys-dot--yellow" />
            <span className="ys-dot ys-dot--green" />
            <div className="ys-arch-tab">
              <Server size={12} strokeWidth={2.5} />
              architecture.ts
            </div>
            <div className="ys-arch-meta">{t('proof.arch_meta')}</div>
          </div>

          <div className="ys-arch-body">
            <div className="ys-arch-grid">
              {NODES.map((node, i) => {
                const Icon = node.icon;
                return (
                  <React.Fragment key={node.id}>
                    <div className={`ys-arch-node ${node.highlight ? 'is-highlight' : ''}`}>
                      <div className="ys-arch-node-icon">
                        <Icon size={18} strokeWidth={2} />
                      </div>
                      <div className="ys-arch-node-body">
                        <div className="ys-arch-node-tag">{t(`proof.nodes.${i}.tag`)}</div>
                        <div className="ys-arch-node-label">{t(`proof.nodes.${i}.label`)}</div>
                        <div className="ys-arch-node-desc">{t(`proof.nodes.${i}.desc`)}</div>
                      </div>
                      <span className="ys-arch-node-index">0{i + 1}</span>
                    </div>
                    {i < NODES.length - 1 && (
                      <div className="ys-arch-connector" aria-hidden="true">
                        <span className="ys-arch-connector-line" />
                        <span className="ys-arch-connector-arrow">↓</span>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="ys-arch-footer">
            <span className="ys-arch-status">
              <span className="ys-arch-status-dot" /> {t('proof.status')}
            </span>
            <span className="ys-arch-build">build #20260528 · &lt; 18ms p95</span>
          </div>
        </div>
      </div>
    </section>
  );
};
