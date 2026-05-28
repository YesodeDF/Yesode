import React from 'react';
import { Boxes, Server, Database, BarChart3, ShieldCheck } from 'lucide-react';
import './ProofOfEngineering.scss';

const NODES = [
  { id: 'gateway', icon: ShieldCheck, label: 'API Gateway', tag: 'Edge', desc: 'mTLS · Rate limit · WAF' },
  { id: 'core', icon: Boxes, label: 'Microservices Core', tag: 'Domain', desc: 'Event-driven · Hexagonal', highlight: true },
  { id: 'data', icon: Database, label: 'Data Layer', tag: 'Persistence', desc: 'PostgreSQL · Redis · S3' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics & KPIs', tag: 'Insights', desc: 'Real-time OLAP · Dashboards' },
];

export const ProofOfEngineering: React.FC = () => {
  return (
    <section className="ys-proof ys-section" id="proof">
      <div className="container">
        <div className="ys-proof-head">
          <span className="ys-eyebrow">Reference Architecture</span>
          <h2 className="ys-section-title">
            Engenharia <span className="gradient-text-gold">composta</span>, não improvisada.
          </h2>
          <p className="ys-section-subtitle">
            Cada camada é projetada com responsabilidade clara, observabilidade nativa e
            zero acoplamento desnecessário. Resultado: previsibilidade em produção.
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
            <div className="ys-arch-meta">main · prod · v1.0.0</div>
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
                        <div className="ys-arch-node-tag">{node.tag}</div>
                        <div className="ys-arch-node-label">{node.label}</div>
                        <div className="ys-arch-node-desc">{node.desc}</div>
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
              <span className="ys-arch-status-dot" /> All systems operational
            </span>
            <span className="ys-arch-build">build #20260528 · &lt; 18ms p95</span>
          </div>
        </div>
      </div>
    </section>
  );
};
