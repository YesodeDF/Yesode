import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '../../utils/analytics';
import './LanguageSwitcher.scss';

interface LanguageOption {
  code: string;
  label: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'pt', label: 'PT', flag: '🇧🇷' },
  { code: 'es', label: 'ES', flag: '🇪🇸' }
];

export const LanguageSwitcher: React.FC = () => {
  const { lang = 'en' } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitch = (code: string) => {
    setIsOpen(false);
    if (code === lang) return;

    trackEvent('language_change', { from: lang, to: code });

    let newPath = location.pathname;
    const supportedLangs = ['en', 'pt', 'es'];
    
    // Find the first segment of the path
    const segments = location.pathname.split('/');
    if (segments.length > 1 && supportedLangs.includes(segments[1])) {
      segments[1] = code;
      newPath = segments.join('/');
    } else {
      newPath = `/${code}${location.pathname}`;
    }

    navigate(`${newPath}${location.search}${location.hash}`);
  };

  return (
    <div className="ys-lang-switcher" ref={dropdownRef}>
      <button
        type="button"
        className={`ys-lang-btn ${isOpen ? 'is-active' : ''}`}
        aria-label="Select Language"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="ys-lang-flag">{currentLang.flag}</span>
        <span className="ys-lang-label">{currentLang.label}</span>
        <span className="ys-lang-arrow">▾</span>
      </button>

      {isOpen && (
        <ul className="ys-lang-dropdown">
          {LANGUAGES.map((option) => (
            <li key={option.code}>
              <button
                type="button"
                className={`ys-lang-option ${option.code === lang ? 'is-selected' : ''}`}
                onClick={() => handleSwitch(option.code)}
              >
                <span className="ys-lang-flag">{option.flag}</span>
                <span className="ys-lang-label-full">
                  {i18n.t(`lang.${option.code}`, option.label)}
                </span>
                {option.code === lang && <span className="ys-lang-check">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
