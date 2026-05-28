import React from 'react';
import { Search, Sparkles, Code2, Cpu, GitBranch, ShieldCheck } from 'lucide-react';
import './ValuePillars.scss';

const PILLARS = [
  {
    icon: Search,
    title: 'Deep Search & KPIs',
    desc: 'Tomada de decisão baseada em dados reais e indexação profunda da operação. Métricas conectadas ao P&L.',
    tag: 'Insight',
    size: 'lg',
  },
  {
    icon: Sparkles,
    title: 'Brand Intelligence',
    desc: 'Soluções alinhadas à identidade e tom de voz do negócio.',
    tag: 'Voice',
    size: 'sm',
  },
  {
    icon: Code2,
    title: 'Engineering by Design',
    desc: 'Arquitetura sob medida desde o primeiro token — sem concessões.',
    tag: 'Core',
    size: 'sm',
  },
  {
    icon: Cpu,
    title: 'Infra como Produto',
    desc: 'Plataformas internas que aceleram o time, não que pedem manutenção.',
    tag: 'Platform',
    size: 'md',
  },
  {
    icon: GitBranch,
    title: 'Continuous Delivery',
    desc: 'Pipelines determinísticos, blue/green, observabilidade end-to-end.',
    tag: 'Ops',
    size: 'md',
  },
  {
    icon: ShieldCheck,
    title: 'Security by Default',
    desc: 'Zero-trust, criptografia em trânsito e repouso, auditoria contínua.',
    tag: 'Trust',
    size: 'md',
  },
];

export const ValuePillars: React.FC = () => {
  return (
    <section className="ys-pillars ys-section" id="pillars">
      <div className="ys-grid-bg" />
      <div className="container">
        <div className="ys-pillars-head">
          <span className="ys-eyebrow">Capacidades</span>
          <h2 className="ys-section-title">
            Seis pilares. <span className="gradient-text-gold">Uma única tese</span> de engenharia.
          </h2>
          <p className="ys-section-subtitle">
            Cada capacidade resolve um problema operacional concreto. Você compõe o
            seu próprio stack, sem amarrar o roadmap a um único fornecedor.
          </p>
        </div>

        <div className="ys-pillars-grid">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <article key={p.title} className={`ys-pillar ys-pillar--${p.size}`}>
                <div className="ys-pillar-icon">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <div className="ys-pillar-tag">{p.tag}</div>
                <h3 className="ys-pillar-title">{p.title}</h3>
                <p className="ys-pillar-desc">{p.desc}</p>
                <div className="ys-pillar-glow" aria-hidden="true" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
