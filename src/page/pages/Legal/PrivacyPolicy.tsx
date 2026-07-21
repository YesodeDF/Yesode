import React from 'react';
import { Shield, Clock, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Legal.scss';

export const PrivacyPolicy: React.FC = () => {
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
            <ArrowLeft size={14} /> {t('privacy.back')}
          </Link>
          <h1 className="ys-legal-title gradient-text">
            {t('privacy.title')}<span className="gradient-text-gold">{t('privacy.title_highlight')}</span>
          </h1>
          <div className="ys-legal-meta">
            <span>
              <Clock size={12} /> {t('privacy.meta_updated')}
            </span>
            <span>
              <Shield size={12} /> {t('privacy.meta_compliance')}
            </span>
          </div>
        </div>

        <div className="ys-legal-content">
          <p>
            {t('privacy.intro')}
          </p>

          <h2>{t('privacy.s1_title')}</h2>
          <p>
            {t('privacy.s1_p1')}
          </p>
          <p>
            {t('privacy.s1_p2')}
          </p>

          <h2>{t('privacy.s2_title')}</h2>
          <p>
            {t('privacy.s2_intro')}
          </p>
          <ul>
            <li>{t('privacy.s2_item_name')}</li>
            <li>{t('privacy.s2_item_email')}</li>
            <li>{t('privacy.s2_item_company')}</li>
          </ul>

          <div className="ys-legal-highlight-box">
            <p>
              {t('privacy.s2_highlight')}
            </p>
          </div>

          <h2>{t('privacy.s3_title')}</h2>
          <p>
            {t('privacy.s3_intro')}
          </p>
          <ol>
            <li>{t('privacy.s3_item_1')}</li>
            <li>{t('privacy.s3_item_2')}</li>
          </ol>

          <h2>{t('privacy.s4_title')}</h2>
          <p>
            {t('privacy.s4_p1')}
          </p>
          <p>
            {t('privacy.s4_p2')}
          </p>

          <h2>{t('privacy.s5_title')}</h2>
          <p>
            {t('privacy.s5_intro')}
          </p>
          <ul>
            <li>{t('privacy.s5_item_1')}</li>
            <li>{t('privacy.s5_item_2')}</li>
            <li>{t('privacy.s5_item_3')}</li>
            <li>{t('privacy.s5_item_4')}</li>
          </ul>

          <h2>{t('privacy.s6_title')}</h2>
          <p>
            {t('privacy.s6_p1')}
          </p>
          <p>
            {t('privacy.s6_p2')}
          </p>

          <h2>{t('privacy.s7_title')}</h2>
          <p>
            {t('privacy.s7_p1')}
          </p>

          <div className="ys-legal-contact-card">
            <h3>{t('privacy.contact_title')}</h3>
            <p>
              {t('privacy.contact_text')}
            </p>
            <a href="mailto:dpo@yesode.com.br" className="ys-contact-email">
              dpo@yesode.com.br
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
