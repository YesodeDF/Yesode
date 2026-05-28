import React from 'react';
import { Linkedin, Github, Mail, ArrowUpRight } from 'lucide-react';
import './Footer.scss';

const COLUMNS = [
  {
    title: 'Capacidades',
    links: [
      { label: 'Deep Search & KPIs', href: '#pillars' },
      { label: 'Brand Intelligence', href: '#pillars' },
      { label: 'Engineering by Design', href: '#pillars' },
      { label: 'Infra como Produto', href: '#pillars' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Cases', href: '#cases' },
      { label: 'Processo', href: '#process' },
      { label: 'Arquitetura', href: '#proof' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Status', href: '#', external: true },
      { label: 'Privacidade', href: '#' },
      { label: 'Termos', href: '#' },
    ],
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className="ys-footer">
      <div className="container">
        <div className="ys-footer-top">
          <div className="ys-footer-brand-col">
            <div className="ys-footer-logo">
              <svg width="32" height="32" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="ys-footer-grad" x1="0" y1="0" x2="28" y2="28">
                    <stop offset="0%" stopColor="#E0C277" />
                    <stop offset="100%" stopColor="#C4A962" />
                  </linearGradient>
                </defs>
                <path d="M4 6 L14 14 L24 6 L24 10 L14 18 L4 10 Z" fill="url(#ys-footer-grad)" />
                <rect x="12" y="16" width="4" height="8" rx="1" fill="url(#ys-footer-grad)" />
              </svg>
              <span className="ys-footer-name">Yesode<span className="ys-footer-dot">.</span></span>
            </div>
            <p className="ys-footer-tagline">
              Arquitetura sob medida. Engenharia direta. Resultados verificáveis.
            </p>
            <div className="ys-footer-social">
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin size={16} strokeWidth={2} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github size={16} strokeWidth={2} />
              </a>
              <a href="mailto:contato@yesode.com" aria-label="E-mail">
                <Mail size={16} strokeWidth={2} />
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="ys-footer-col">
              <h4 className="ys-footer-col-title">{col.title}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                    >
                      {link.label}
                      {link.external && <ArrowUpRight size={12} strokeWidth={2.5} />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="ys-footer-bottom">
          <span className="ys-footer-copyright">
            © {new Date().getFullYear()} Yesode. Todos os direitos reservados.
          </span>
          <span className="ys-footer-status">
            <span className="ys-footer-status-dot" />
            <span className="font-code">All systems operational</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
