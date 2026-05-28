import React from 'react';
import { Compass, PenTool, Hammer, Activity } from 'lucide-react';
import './Process.scss';

const PHASES = [
  {
    icon: Compass,
    phase: '01',
    title: 'Discovery',
    duration: '1—2 semanas',
    desc: 'Imersão no problema real. Mapeamos KPIs do P&L, gargalos técnicos e restrições.',
    deliverables: ['Diagnóstico técnico', 'Mapa de riscos', 'Plano de ataque'],
  },
  {
    icon: PenTool,
    phase: '02',
    title: 'Architecture',
    duration: '2—3 semanas',
    desc: 'Desenho da solução com decisões registradas. Tradeoffs no papel antes do código.',
    deliverables: ['ADRs', 'Diagrama de arquitetura', 'Orçamento de SLO'],
  },
  {
    icon: Hammer,
    phase: '03',
    title: 'Build',
    duration: '6—16 semanas',
    desc: 'Execução em squads enxutos. Entregas semanais com demos e métricas vivas.',
    deliverables: ['Releases incrementais', 'Pipeline CI/CD', 'Observabilidade'],
  },
  {
    icon: Activity,
    phase: '04',
    title: 'Run',
    duration: 'Contínuo',
    desc: 'Operação assistida com on-call, ajustes finos e handoff progressivo para o time interno.',
    deliverables: ['Runbooks', 'Treinamento do time', 'Pós-mortem cultura'],
  },
];

export const Process: React.FC = () => {
  return (
    <section className="ys-process ys-section" id="process" aria-label="Processo de engenharia">
      <div className="container">
        <div className="ys-process-head">
          <span className="ys-eyebrow">Processo</span>
          <h2 className="ys-section-title">
            Quatro fases. <span className="gradient-text-gold">Zero surpresas</span>.
          </h2>
          <p className="ys-section-subtitle">
            Você sabe exatamente o que esperar em cada janela de tempo, qual entregável
            chega ao final e como medimos sucesso.
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
                    <h3 className="ys-process-step-title">{p.title}</h3>
                    <span className="ys-process-step-duration">{p.duration}</span>
                  </div>
                  <p className="ys-process-step-desc">{p.desc}</p>
                  <ul className="ys-process-step-deliverables">
                    {p.deliverables.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
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
