import React from 'react';
import { TrendingDown, Zap, Layers } from 'lucide-react';
import './Cases.scss';

const CASES = [
  {
    industry: 'Fintech LATAM',
    title: 'Migração de monólito legado para malha de serviços',
    before: 'Deploy 1× por semana · lead time 14 dias',
    after: 'Deploy 32× por dia · lead time 3h',
    kpi: '-62%',
    kpiLabel: 'lead time de produção',
    icon: TrendingDown,
    badge: 'Plataforma',
  },
  {
    industry: 'Healthtech BR',
    title: 'Orquestração de prontuários em escala nacional',
    before: 'p95 de 1.2s · 4 incidentes/mês',
    after: 'p95 de 180ms · 0 incidentes em 6 meses',
    kpi: '6.6×',
    kpiLabel: 'mais rápido em produção',
    icon: Zap,
    badge: 'Performance',
  },
  {
    industry: 'Retail Omnichannel',
    title: 'OMS unificado com integração ERP em tempo real',
    before: 'Estoque desalinhado · 3% pedidos cancelados',
    after: 'Sincronização sub-segundo · 0.2% cancelamentos',
    kpi: '-93%',
    kpiLabel: 'cancelamentos por desalinhamento',
    icon: Layers,
    badge: 'Integração',
  },
];

export const Cases: React.FC = () => {
  return (
    <section className="ys-cases ys-section" id="cases" aria-label="Cases de engenharia">
      <div className="container">
        <div className="ys-cases-head">
          <span className="ys-eyebrow">Resultados</span>
          <h2 className="ys-section-title">
            KPIs movidos. <span className="gradient-text-gold">Não apenas código entregue.</span>
          </h2>
          <p className="ys-section-subtitle">
            Casos anonimizados. Métricas reais. Cada engajamento começa com um
            número de partida e termina com um número-alvo — auditado.
          </p>
        </div>

        <div className="ys-cases-grid">
          {CASES.map((c) => {
            const Icon = c.icon;
            return (
              <article key={c.title} className="ys-case">
                <div className="ys-case-head">
                  <span className="ys-case-industry">{c.industry}</span>
                  <span className="ys-case-badge">{c.badge}</span>
                </div>

                <h3 className="ys-case-title">{c.title}</h3>

                <div className="ys-case-kpi">
                  <div className="ys-case-kpi-icon">
                    <Icon size={18} strokeWidth={2.25} />
                  </div>
                  <div className="ys-case-kpi-body">
                    <div className="ys-case-kpi-value">{c.kpi}</div>
                    <div className="ys-case-kpi-label">{c.kpiLabel}</div>
                  </div>
                </div>

                <dl className="ys-case-delta">
                  <div className="ys-case-delta-row">
                    <dt>Antes</dt>
                    <dd>{c.before}</dd>
                  </div>
                  <div className="ys-case-delta-row ys-case-delta-row--after">
                    <dt>Depois</dt>
                    <dd>{c.after}</dd>
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
