import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { scrollToSection } from '../../utils/scrollToSection';
import { trackEvent } from '../../utils/analytics';
import './Header.scss';

const NAV_LINKS = [
  { id: 'pillars', label: 'Capacidades' },
  { id: 'cases', label: 'Cases' },
  { id: 'process', label: 'Processo' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contato' },
];

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (id: string) => {
    setMobileOpen(false);
    trackEvent('nav_link_click', { target: id });
    scrollToSection(id);
  };

  const handleHeaderCta = () => {
    trackEvent('cta_header_click');
    setMobileOpen(false);
    scrollToSection('contact');
  };

  return (
    <header className={`ys-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="ys-header-shell">
        <a className="ys-logo" href="#" aria-label="Yesode">
          <svg className="ys-logo-mark" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="ys-logo-grad" x1="0" y1="0" x2="28" y2="28">
                <stop offset="0%" stopColor="#E0C277" />
                <stop offset="100%" stopColor="#C4A962" />
              </linearGradient>
            </defs>
            <path d="M4 6 L14 14 L24 6 L24 10 L14 18 L4 10 Z" fill="url(#ys-logo-grad)" />
            <rect x="12" y="16" width="4" height="8" rx="1" fill="url(#ys-logo-grad)" />
          </svg>
          <span className="ys-logo-text">Yesode</span>
          <span className="ys-logo-dot">.</span>
        </a>

        <nav className="ys-nav" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              className="ys-nav-link"
              onClick={() => handleNav(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="ys-operations">
          <ThemeToggle />
          <Button
            label="Agendar Consultoria"
            className="p-button-primary ys-cta-btn"
            onClick={handleHeaderCta}
          />
          <button
            type="button"
            className={`ys-burger ${mobileOpen ? 'is-open' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`ys-mobile-panel ${mobileOpen ? 'is-open' : ''}`}>
        {NAV_LINKS.map((link) => (
          <button
            key={link.id}
            type="button"
            className="ys-mobile-link"
            onClick={() => handleNav(link.id)}
          >
            {link.label}
          </button>
        ))}
      </div>
    </header>
  );
};
