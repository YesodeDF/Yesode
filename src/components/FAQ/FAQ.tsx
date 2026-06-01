import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';
import './FAQ.scss';

const ITEMS = [
  {
    q: 'Quanto custa um engajamento com a Yesode?',
    a: 'Trabalhamos com pacotes de Discovery (fixo) e contratos de execução (mensais ou por entrega). Após o Discovery — entre 1 e 2 semanas — apresentamos a estimativa fechada com tradeoffs explícitos. Sem hora cheia, sem surpresa no fim do mês.',
  },
  {
    q: 'Qual é o prazo médio de um projeto?',
    a: 'Plataformas críticas costumam variar entre 8 e 24 semanas em janelas de execução. O Run é contínuo. Você sempre tem uma versão funcionando em produção a partir da semana 6, no pior cenário.',
  },
  {
    q: 'Vocês assinam NDA?',
    a: 'Sim. NDA mútuo já na primeira reunião. Modelo enxuto, sem cláusulas abusivas — pronto para revisão jurídica. Tudo o que ouvimos no Discovery é confidencial por padrão.',
  },
  {
    q: 'Trabalham com nosso time interno ou substituem ele?',
    a: 'Reforçamos o time interno. Atuamos como squad acoplado: code review, pair, ADRs, ritos de planejamento. O objetivo do contrato é elevar o nível do time interno — não criar dependência.',
  },
  {
    q: 'Qual stack vocês dominam?',
    a: 'TypeScript, Go, Rust e Python para serviços. PostgreSQL, Redis, Kafka, S3 para dados. Kubernetes, Terraform e AWS para infra. Frontend em React/Next. Stack é decisão de Discovery — escolhemos pelo problema, não pela moda.',
  },
  {
    q: 'Como vocês medem sucesso de um projeto?',
    a: 'Cada engajamento começa com um KPI quantificado do P&L (lead time, conversão, custo de infra, NPS técnico). Auditamos esse KPI no final. Se não mexer, refazemos o escopo sem cobrar.',
  },
  {
    q: 'Como funciona a manutenção e evolução após a entrega?',
    a: 'O "Run" (operação) pode ser absorvido pelo seu time interno após o nosso handoff progressivo, ou podemos atuar em formato de retainer/on-call para suporte contínuo e arquitetura evolutiva.',
  },
  {
    q: 'Vocês vendem horas de desenvolvedores (Body Shop/Outsourcing)?',
    a: 'Não. Nós assumimos a responsabilidade técnica pela entrega de um escopo ou solução arquitetural. Não vendemos "cabeças" para tapar buraco em squads, entregamos engenharia que resolve gargalos de P&L.',
  },
];

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    const willOpen = openIdx !== idx;
    setOpenIdx(willOpen ? idx : null);
    if (willOpen) {
      trackEvent('faq_open', { index: idx, question: ITEMS[idx].q });
    }
  };

  return (
    <section className="ys-faq ys-section" id="faq" aria-label="Perguntas frequentes">
      <div className="container">
        <div className="ys-faq-grid">
          <div className="ys-faq-head">
            <span className="ys-eyebrow">FAQ</span>
            <h2 className="ys-section-title">
              Perguntas <span className="gradient-text-gold">honestas</span>.
              <br />Respostas idem.
            </h2>
            <p className="ys-section-subtitle">
              Se a sua pergunta não está aqui, escreva no formulário abaixo. Respondemos
              em até 24h úteis, sem rodeios comerciais.
            </p>
          </div>

          <ul className="ys-faq-list">
            {ITEMS.map((item, i) => {
              const isOpen = openIdx === i;
              const Icon = isOpen ? Minus : Plus;
              return (
                <li
                  key={item.q}
                  className={`ys-faq-item ${isOpen ? 'is-open' : ''}`}
                >
                  <button
                    type="button"
                    className="ys-faq-trigger"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                  >
                    <span className="ys-faq-q">{item.q}</span>
                    <span className="ys-faq-icon" aria-hidden="true">
                      <Icon size={16} strokeWidth={2.5} />
                    </span>
                  </button>
                  <div
                    id={`faq-panel-${i}`}
                    className="ys-faq-panel"
                    role="region"
                    aria-hidden={!isOpen}
                  >
                    <p>{item.a}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};
