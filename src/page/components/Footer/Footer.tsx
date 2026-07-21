import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Linkedin, Github, Mail, ArrowUpRight } from 'lucide-react';
import './Footer.scss';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { lang = 'en' } = useParams<{ lang: string }>();

  const columns = [
    {
      title: t('footer.col_capabilities'),
      links: [
        { label: t('pillars.items.0.title'), href: `/${lang}#pillars` },
        { label: t('pillars.items.1.title'), href: `/${lang}#pillars` },
        { label: t('pillars.items.2.title'), href: `/${lang}#pillars` },
        { label: t('pillars.items.3.title'), href: `/${lang}#pillars` },
      ],
    },
    {
      title: t('footer.col_company'),
      links: [
        { label: t('footer.link_cases'), href: `/${lang}#cases` },
        { label: t('footer.link_process'), href: `/${lang}#process` },
        { label: t('footer.link_architecture'), href: `/${lang}#proof` },
        { label: t('footer.link_faq'), href: `/${lang}#faq` },
      ],
    },
    {
      title: t('footer.col_resources'),
      links: [
        { label: t('footer.link_status'), href: 'https://status.yesode.com.br', external: true },
        { label: t('footer.link_privacy'), href: `/${lang}/politica-de-privacidade` },
        { label: t('footer.link_terms'), href: `/${lang}/termos-de-uso` },
      ],
    },
  ];

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
              {t('footer.tagline')}
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

          {columns.map((col) => (
            <div key={col.title} className="ys-footer-col">
              <h4 className="ys-footer-col-title">{col.title}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                        <ArrowUpRight size={12} strokeWidth={2.5} />
                      </a>
                    ) : (
                      <Link to={link.href}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="ys-footer-bottom">
          <span className="ys-footer-copyright">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </span>
          <span className="ys-footer-status">
            <span className="ys-footer-status-dot" />
            <span className="font-code">{t('footer.status')}</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
