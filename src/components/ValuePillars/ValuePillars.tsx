import React from 'react';
import { Card } from 'primereact/card';
import './ValuePillars.scss';

export const ValuePillars: React.FC = () => {
  return (
    <section className="ys-pillars">
      <div className="container">
        <div className="ys-pillars-grid">
          <Card title="Deep Search & KPIs" className="ys-pillar-card">
            <p className="m-0">Tomada de decisão baseada em dados reais e indexação profunda da sua operação.</p>
          </Card>
          <Card title="Brand Intelligence" className="ys-pillar-card">
            <p className="m-0">Soluções tecnológicas estritamente alinhadas à identidade e ao tom de voz do negócio.</p>
          </Card>
          <Card title="Engineering by Design" className="ys-pillar-card">
            <p className="m-0">Arquitetura construída sob medida desde o primeiro token, sem concessões.</p>
          </Card>
        </div>
      </div>
    </section>
  );
};
