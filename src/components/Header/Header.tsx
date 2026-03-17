import React from 'react';
import { Button } from 'primereact/button';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import './Header.scss';

export const Header: React.FC = () => {
  return (
    <header className="ys-header">
      <div className="container ys-header-content">
        <div className="ys-logo">
          <span className="ys-logo-text">Yesode</span>
          <span className="ys-logo-dot">.</span>
        </div>
        <div className="ys-operations">
          <ThemeToggle />
          <Button label="Agendar Consultoria Gratuita" className="p-button-primary ys-cta-btn" />
        </div>
      </div>
    </header>
  );
};
