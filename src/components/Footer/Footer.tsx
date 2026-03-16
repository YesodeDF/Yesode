import React from 'react';
import './Footer.scss';

export const Footer: React.FC = () => {
  return (
    <footer className="ys-footer">
      <div className="container ys-footer-content">
        <div className="ys-footer-brand">
          Yesode © 2026
        </div>
        <div className="ys-footer-links">
          <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="#" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
    </footer>
  );
};
