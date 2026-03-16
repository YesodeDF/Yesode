import React from 'react';
import { Button } from 'primereact/button';
import './Hero.scss';

export const Hero: React.FC = () => {
  return (
    <section className="ys-hero">
      <div className="ys-hero-grid"></div>
      <div className="container ys-hero-content">
        <h1 className="ys-hero-title">
          Entregamos <span>soluções</span>,<br />não apenas projetos.
        </h1>
        <p className="ys-hero-subtitle">
          Projetamos arquiteturas de software sob medida para<br />
          resolver problemas complexos de negócio.
        </p>
        <div className="ys-hero-actions">
          <Button label="Agendar Consultoria Gratuita" className="p-button-primary p-button-lg" />
        </div>
      </div>
    </section>
  );
};
