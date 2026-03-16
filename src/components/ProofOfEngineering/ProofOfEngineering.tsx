import React from 'react';
import './ProofOfEngineering.scss';

export const ProofOfEngineering: React.FC = () => {
  return (
    <section className="ys-proof">
      <div className="container">
        <div className="ys-arch-block font-code">
          <div className="ys-arch-header">
            <span className="ys-dot bg-red"></span>
            <span className="ys-dot bg-yellow"></span>
            <span className="ys-dot bg-green"></span>
            <span className="ys-arch-title">architecture.ts</span>
          </div>
          <div className="ys-arch-body">
            <div className="ys-arch-node">[ API Gateway ]</div>
            <div className="ys-arch-flow">↓</div>
            <div className="ys-arch-node ys-arch-highlight">[ Microservices Core ]</div>
            <div className="ys-arch-flow">↓</div>
            <div className="ys-arch-node">[ Data Layer / PostgreSQL ]</div>
            <div className="ys-arch-flow">↓</div>
            <div className="ys-arch-node">[ Analytics & KPIs ]</div>
          </div>
        </div>
      </div>
    </section>
  );
};
