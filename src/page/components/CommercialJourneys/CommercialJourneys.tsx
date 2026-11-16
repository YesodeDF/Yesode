import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, Cpu, ArrowRight, CheckCircle2, FileCode2 } from 'lucide-react';
import { getStrategicPath, normalizeLang } from '@/modules/landing/domain/ToolRoutes.ts';
import './CommercialJourneys.scss';

export const CommercialJourneys: React.FC = () => {
  const { t } = useTranslation();
  const { lang: rawLang = 'pt' } = useParams<{ lang: string }>();
  const lang = normalizeLang(rawLang);

  const enterpriseBullets = t('journeys.enterprise.bullets', { returnObjects: true }) as string[];
  const businessBullets = t('journeys.business.bullets', { returnObjects: true }) as string[];

  return (
    <section className="ys-journeys ys-section" id="solutions" aria-label={t('journeys.aria_label')}>
      <div className="container">
        <div className="ys-journeys-head">
          <span className="ys-eyebrow">{t('journeys.eyebrow')}</span>
          <h2 className="ys-section-title">
            {t('journeys.title')}
            <span className="gradient-text-gold">{t('journeys.title_highlight')}</span>
            {t('journeys.title_suffix')}
          </h2>
          <p className="ys-section-subtitle">{t('journeys.subtitle')}</p>
        </div>

        <div className="ys-journeys-grid">
          {/* Enterprise Card */}
          <article className="ys-journey-card ys-journey-card--enterprise">
            <div className="ys-journey-top">
              <div className="ys-journey-badge ys-journey-badge--gold">
                <Building2 size={14} strokeWidth={2.25} />
                <span>{t('journeys.enterprise.badge')}</span>
              </div>
              <span className="ys-journey-audience font-code">{t('journeys.enterprise.audience')}</span>
            </div>

            <h3 className="ys-journey-title">{t('journeys.enterprise.title')}</h3>
            <p className="ys-journey-semantic">{t('journeys.enterprise.semantic')}</p>
            <p className="ys-journey-desc">{t('journeys.enterprise.desc')}</p>

            <ul className="ys-journey-list">
              {Array.isArray(enterpriseBullets) &&
                enterpriseBullets.map((item, i) => (
                  <li key={i}>
                    <CheckCircle2 size={16} strokeWidth={2.25} />
                    <span>{item}</span>
                  </li>
                ))}
            </ul>

            <div className="ys-journey-footer">
              <Link to={getStrategicPath(lang, 'enterprise')} className="ys-journey-cta ys-journey-cta--primary">
                <span>{t('journeys.enterprise.cta')}</span>
                <ArrowRight size={16} strokeWidth={2.25} />
              </Link>
            </div>
          </article>

          {/* Business / SMB Card */}
          <article className="ys-journey-card ys-journey-card--business">
            <div className="ys-journey-top">
              <div className="ys-journey-badge ys-journey-badge--violet">
                <Cpu size={14} strokeWidth={2.25} />
                <span>{t('journeys.business.badge')}</span>
              </div>
              <span className="ys-journey-audience font-code">{t('journeys.business.audience')}</span>
            </div>

            <h3 className="ys-journey-title">{t('journeys.business.title')}</h3>
            <p className="ys-journey-semantic">{t('journeys.business.semantic')}</p>
            <p className="ys-journey-desc">{t('journeys.business.desc')}</p>

            <ul className="ys-journey-list">
              {Array.isArray(businessBullets) &&
                businessBullets.map((item, i) => (
                  <li key={i}>
                    <CheckCircle2 size={16} strokeWidth={2.25} />
                    <span>{item}</span>
                  </li>
                ))}
            </ul>

            <div className="ys-journey-footer">
              <Link to={getStrategicPath(lang, 'business')} className="ys-journey-cta ys-journey-cta--secondary">
                <span>{t('journeys.business.cta')}</span>
                <ArrowRight size={16} strokeWidth={2.25} />
              </Link>
            </div>
          </article>
        </div>

        <div className="ys-journeys-evidence-bar">
          <div className="ys-journeys-evidence-text">
            <FileCode2 size={18} className="ys-journeys-evidence-icon" />
            <div>
              <strong>{t('journeys.cases_bar.title')}</strong>
              <span>{t('journeys.cases_bar.desc')}</span>
            </div>
          </div>
          <Link to={getStrategicPath(lang, 'cases')} className="ys-journeys-evidence-link">
            <span>{t('journeys.cases_bar.cta')}</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
};
