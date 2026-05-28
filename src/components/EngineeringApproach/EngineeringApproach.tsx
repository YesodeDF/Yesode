import React from 'react';
import { Zap, Users, Target } from 'lucide-react';
import './EngineeringApproach.scss';

const STATS = [
  { icon: Zap, value: '0', label: 'Camadas de Intermediação', desc: 'Direto com a engenharia.' },
  { icon: Target, value: '1', label: 'Ponto Único de Contato', desc: 'CTO ou Lead Engineer.' },
  { icon: Users, value: '100%', label: 'Foco no Resultado', desc: 'KPIs do P&L, não do PM.' },
];

export const EngineeringApproach: React.FC = () => {
  return (
    <section className="ys-approach ys-section" id="approach">
      <div className="container">
        <div className="ys-approach-grid">
          <div className="ys-approach-content">
            <span className="ys-eyebrow">Abordagem</span>
            <h2 className="ys-section-title">
              Sua empresa no <span className="gradient-text-gold">centro</span> da engenharia.
            </h2>
            <p className="ys-approach-text">
              O intermediário é o inimigo da execução. Na Yesode, você conversa direto
              com o centro nervoso da engenharia. Nada de gerentes de projeto bloqueando
              o código, nada de telefone sem fio.
            </p>
            <p className="ys-approach-text ys-approach-text--muted">
              O que garante decisões cirúrgicas, arquitetura precisa e entregas
              alinhadas com o objetivo financeiro da sua operação.
            </p>

            <div className="ys-approach-quote">
              <div className="ys-approach-quote-bar" aria-hidden="true" />
              <div className="ys-approach-quote-body">
                <span className="ys-approach-quote-tag">/* Princípio */</span>
                <p>
                  "Cada linha de código entregue tem uma justificativa
                  econômica. Cada decisão de arquitetura tem dono."
                </p>
              </div>
            </div>
          </div>

          <div className="ys-approach-stats">
            {STATS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="ys-approach-stat">
                  <div className="ys-approach-stat-icon">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <div className="ys-approach-stat-body">
                    <div className="ys-approach-stat-value">{s.value}</div>
                    <div className="ys-approach-stat-label">{s.label}</div>
                    <div className="ys-approach-stat-desc">{s.desc}</div>
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
