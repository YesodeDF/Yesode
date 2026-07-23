import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link, useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';
import { scrollToSection } from '@shared/utils/scrollToSection';
import { trackEvent } from '@shared/utils/analytics';
import { useAuth } from '@shared/context/AuthContext';
import { Mail, FileText, LayoutDashboard } from 'lucide-react';
import './Header.scss';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { lang = 'en' } = useParams<{ lang: string }>();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, openLoginModal } = useAuth();

  const isHome = location.pathname === `/${lang}` || location.pathname === `/${lang}/`;

  const navLinks = [
    { id: 'products', label: t('header.nav_products') },
    { id: 'pillars', label: t('header.nav_capabilities') },
    { id: 'cases', label: t('header.nav_cases') },
    { id: 'process', label: t('header.nav_process') },
    { id: 'faq', label: t('header.nav_faq') },
    { id: 'contact', label: t('header.nav_contact') },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (id: string) => {
    setMobileOpen(false);
    trackEvent('nav_link_click', { target: id });
    if (!isHome) {
      navigate(`/${lang}#` + id);
    } else {
      scrollToSection(id);
    }
  };

  const handleHeaderCta = () => {
    trackEvent('cta_header_click');
    setMobileOpen(false);
    if (!isHome) {
      navigate(`/${lang}#contact`);
    } else {
      scrollToSection('contact');
    }
  };

  // Secret login trigger when clicking logo
  const handleLogoClick = (e: React.MouseEvent) => {
    if (isAuthenticated) {
      // Direct navigation to admin if already authenticated
      navigate('/admin');
    } else {
      // Secret login camera trigger
      e.preventDefault();
      openLoginModal();
    }
  };

  return (
    <header className={`ys-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="ys-header-shell">
        <Link 
          className="ys-logo" 
          to={isAuthenticated ? "/admin" : `/${lang}`} 
          onClick={handleLogoClick}
          aria-label="Yesode"
          title={isAuthenticated ? "Ir para Painel Admin" : "Yesode"}
        >
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
        </Link>

        <nav className="ys-nav" aria-label={t('social.aria_label')}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              className="ys-nav-link"
              onClick={() => handleNav(link.id)}
            >
              {link.label}
            </button>
          ))}

          {/* Opções exibidas no menu QUANDO LOGADO */}
          {isAuthenticated && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid rgba(196, 169, 98, 0.3)' }}>
              <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#C4A962', fontWeight: 600, fontSize: '0.85rem' }}>
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              <Link to="/admin/invite" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#9CA3AF', fontSize: '0.85rem' }}>
                <Mail size={15} /> Convites
              </Link>
              <Link to="/admin/proposals/mi-abuela" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#9CA3AF', fontSize: '0.85rem' }}>
                <FileText size={15} /> Mi Abuela
              </Link>
            </div>
          )}
        </nav>

        <div className="ys-operations">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button
            label={t('header.cta')}
            className="p-button-primary ys-cta-btn"
            onClick={handleHeaderCta}
          />
          <button
            type="button"
            className={`ys-burger ${mobileOpen ? 'is-open' : ''}`}
            aria-label={t('header.toggle_theme')}
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
        {navLinks.map((link) => (
          <button
            key={link.id}
            type="button"
            className="ys-mobile-link"
            onClick={() => handleNav(link.id)}
          >
            {link.label}
          </button>
        ))}

        {isAuthenticated && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(196, 169, 98, 0.3)' }}>
            <Link to="/admin" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#C4A962', fontWeight: 600 }}>
              <LayoutDashboard size={18} /> Dashboard Admin
            </Link>
            <Link to="/admin/invite" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#E5E7EB' }}>
              <Mail size={18} /> Criar Convites
            </Link>
            <Link to="/admin/proposals/mi-abuela" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#E5E7EB' }}>
              <FileText size={18} /> Proposta Mi Abuela
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
