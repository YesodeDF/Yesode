import React from 'react';
import { Lock, FileText, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Legal.scss';

export const TermsOfUse: React.FC = () => {
  const { t } = useTranslation();
  const { lang = 'en' } = useParams<{ lang: string }>();

  return (
    <div className="ys-legal-page">
      <div className="ys-grid-bg" />
      <div className="ys-orb ys-orb--legal" />
      <div className="ys-orb ys-orb--legal-2" />

      <div className="container ys-legal-container">
        <div className="ys-legal-header">
          <Link to={`/${lang}`} className="ys-eyebrow" style={{ textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}>
            <ArrowLeft size={14} /> {t('terms.back')}
          </Link>
          <h1 className="ys-legal-title gradient-text">
            {t('terms.title')}<span className="gradient-text-gold">{t('terms.title_highlight')}</span>
          </h1>
          <div className="ys-legal-meta">
            <span>
              <FileText size={12} /> {t('terms.meta_updated')}
            </span>
            <span>
              <Lock size={12} /> {t('terms.meta_compliance')}
            </span>
          </div>
        </div>

        <div className="ys-legal-content">
          <p>
            {t('terms.intro_1')}
          </p>
          <p>
            {t('terms.intro_2')}
          </p>

          <h2>{t('terms.s1_title')}</h2>
          <p>
            {t('terms.s1_p1')}
          </p>

          <h2>{t('terms.s2_title')}</h2>
          <p>
            {t('terms.s2_p1')}
          </p>
          
          <div className="ys-legal-highlight-box">
            <p>
              {t('terms.s2_highlight')}
            </p>
          </div>

          <h2>{t('terms.s3_title')}</h2>
          <p>
            {t('terms.s3_intro')}
          </p>
          <ul>
            <li>
              <strong>{t('terms.s3_item_1_title')}</strong> {t('terms.s3_item_1_text')}
            </li>
            <li>
              <strong>{t('terms.s3_item_2_title')}</strong> {t('terms.s3_item_2_text')}
            </li>
            <li>
              <strong>{t('terms.s3_item_3_title')}</strong> {t('terms.s3_item_3_text')}
            </li>
          </ul>

          <h2>{t('terms.s4_title')}</h2>
          <p>
            {t('terms.s4_intro')}
          </p>
          <ul>
            <li>{t('terms.s4_item_1')}</li>
            <li>{t('terms.s4_item_2')}</li>
            <li>{t('terms.s4_item_3')}</li>
          </ul>
          <p>
            {t('terms.s4_p2')}
          </p>

          <h2>{t('terms.s5_title')}</h2>
          <p>
            {t('terms.s5_p1')}
          </p>

          <h2>{t('terms.s6_title')}</h2>
          <p>
            {t('terms.s6_p1')}
          </p>

          <div className="ys-legal-contact-card">
            <h3>{t('terms.contact_title')}</h3>
            <p>
              {t('terms.contact_text')}
            </p>
            <a href="mailto:contato@yesode.com.br" className="ys-contact-email">
              contato@yesode.com.br
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
