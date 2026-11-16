import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileCode2, ArrowRight, ArrowLeft } from 'lucide-react';
import { SeoHead } from '@/shared/components/SeoHead.tsx';
import { LeadCapture } from '@/page/components/LeadCapture/LeadCapture.tsx';
import { scrollToSection } from '@shared/utils/scrollToSection';
import {
  BASE_URL,
  getLocaleCode,
  getStrategicAlternates,
  getStrategicPath,
  normalizeLang,
} from '@/modules/landing/domain/ToolRoutes.ts';
import '../StrategicPages.scss';

interface CaseStudyDetail {
  id: string;
  industry: string;
  period: string;
  title: string;
  kpiValue: string;
  kpiLabel: string;
  problem: string;
  baseline: string;
  solution: string;
  measurement: string;
  stack: string[];
}

interface TechnicalInsight {
  category: string;
  readTime: string;
  title: string;
  summary: string;
  takeaway: string;
}

export const CasesPage: React.FC = () => {
  const { t } = useTranslation();
  const { lang: rawLang = 'pt' } = useParams<{ lang: string }>();
  const lang = normalizeLang(rawLang);
  const canonical = `${BASE_URL}${getStrategicPath(lang, 'cases')}`;

  const studies = t('cases_page.studies', { returnObjects: true }) as CaseStudyDetail[];
  const insights = t('cases_page.insights', { returnObjects: true }) as TechnicalInsight[];
  const keywords = t('cases_page.seo_keywords', { returnObjects: true }) as string[];

  const jsonLd: Record<string, any>[] = [
    {
      '@type': 'CollectionPage',
      '@id': `${canonical}#collection`,
      name: t('cases_page.seo_title'),
      url: canonical,
      inLanguage: lang,
      description: t('cases_page.seo_desc'),
      publisher: {
        '@id': `${BASE_URL}/#organization`,
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: t('tools.seo.breadcrumb_home'),
          item: `${BASE_URL}/${lang}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: t('header.nav_cases'),
          item: canonical,
        },
      ],
    },
  ];

  if (Array.isArray(studies)) {
    studies.forEach((cs) => {
      jsonLd.push({
        '@type': 'TechArticle',
        headline: `${cs.industry}: ${cs.title} (${cs.kpiValue} ${cs.kpiLabel})`,
        description: `${cs.problem} ${cs.solution} ${cs.measurement}`,
        author: {
          '@id': `${BASE_URL}/#organization`,
        },
        publisher: {
          '@id': `${BASE_URL}/#organization`,
        },
        inLanguage: lang,
        url: `${canonical}#${cs.id}`,
      });
    });
  }

  if (Array.isArray(insights)) {
    insights.forEach((art, idx) => {
      jsonLd.push({
        '@type': 'Article',
        headline: art.title,
        description: `${art.summary} ${art.takeaway}`,
        author: {
          '@id': `${BASE_URL}/#organization`,
        },
        publisher: {
          '@id': `${BASE_URL}/#organization`,
        },
        inLanguage: lang,
        url: `${canonical}#insight-${idx + 1}`,
      });
    });
  }

  return (
    <div className="ys-strategic-page">
      <SeoHead
        title={t('cases_page.seo_title')}
        description={t('cases_page.seo_desc')}
        canonicalUrl={canonical}
        keywords={Array.isArray(keywords) ? keywords : []}
        locale={getLocaleCode(lang)}
        lang={lang}
        alternates={getStrategicAlternates('cases')}
        jsonLd={jsonLd}
      />

      <div className="container">
        <nav className="ys-strategic-breadcrumb" aria-label="Breadcrumb">
          <Link to={`/${lang}`}>
            <ArrowLeft size={14} />
            <span>{t('tools.seo.breadcrumb_home')}</span>
          </Link>
          <span>/</span>
          <span className="ys-breadcrumb-current">{t('header.nav_cases')}</span>
        </nav>

        <header className="ys-strategic-hero">
          <div className="ys-strategic-badge">
            <FileCode2 size={14} />
            <span>{t('cases_page.badge')}</span>
          </div>
          <h1 className="ys-strategic-title">
            {t('cases_page.title_1')}{' '}
            <span className="gradient-text-gold">{t('cases_page.title_highlight')}</span>
          </h1>
          <p className="ys-strategic-subtitle">{t('cases_page.subtitle')}</p>

          <div className="ys-strategic-actions">
            <button
              type="button"
              className="ys-strategic-btn-primary"
              onClick={() => scrollToSection('contact')}
            >
              <span>{t('cases_page.cta_primary')}</span>
              <ArrowRight size={16} />
            </button>
            <Link to={getStrategicPath(lang, 'enterprise')} className="ys-strategic-btn-secondary">
              <span>{t('header.nav_enterprise')}</span>
              <ArrowRight size={15} />
            </Link>
            <Link to={getStrategicPath(lang, 'business')} className="ys-strategic-btn-secondary">
              <span>{t('header.nav_business')}</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </header>

        <section className="ys-strategic-section">
          <div className="ys-strategic-section-head">
            <span className="ys-eyebrow">{t('cases_page.studies_eyebrow')}</span>
            <h2 className="ys-strategic-section-title">{t('cases_page.studies_title')}</h2>
            <p className="ys-strategic-section-desc">{t('cases_page.studies_desc')}</p>
          </div>

          {Array.isArray(studies) &&
            studies.map((cs) => (
              <article key={cs.id} id={cs.id} className="ys-case-study-block">
                <div className="ys-cs-header">
                  <div>
                    <div className="ys-cs-meta">
                      <span className="ys-cs-industry">{cs.industry}</span>
                      <span className="ys-cs-period">{cs.period}</span>
                    </div>
                    <h3 className="ys-cs-title">{cs.title}</h3>
                  </div>

                  <div className="ys-cs-kpi-pill">
                    <div className="ys-cs-kpi-val">{cs.kpiValue}</div>
                    <div className="ys-cs-kpi-lbl">{cs.kpiLabel}</div>
                  </div>
                </div>

                <div className="ys-cs-grid">
                  <div className="ys-cs-item">
                    <h4>{t('cases_page.labels.problem')}</h4>
                    <p>{cs.problem}</p>
                  </div>
                  <div className="ys-cs-item">
                    <h4>{t('cases_page.labels.baseline')}</h4>
                    <p>{cs.baseline}</p>
                  </div>
                  <div className="ys-cs-item">
                    <h4>{t('cases_page.labels.solution')}</h4>
                    <p>{cs.solution}</p>
                  </div>
                  <div className="ys-cs-item">
                    <h4>{t('cases_page.labels.measurement')}</h4>
                    <p>{cs.measurement}</p>
                  </div>
                </div>

                <div className="ys-cs-stack-row">
                  <div className="ys-cs-stack-tags">
                    {Array.isArray(cs.stack) &&
                      cs.stack.map((tech, i) => <span key={i}>{tech}</span>)}
                  </div>
                </div>
              </article>
            ))}
        </section>

        <section className="ys-strategic-section" id="insights">
          <div className="ys-strategic-section-head">
            <span className="ys-eyebrow">{t('cases_page.insights_eyebrow')}</span>
            <h2 className="ys-strategic-section-title">{t('cases_page.insights_title')}</h2>
            <p className="ys-strategic-section-desc">{t('cases_page.insights_desc')}</p>
          </div>

          <div className="ys-insights-grid">
            {Array.isArray(insights) &&
              insights.map((item, idx) => (
                <article key={idx} id={`insight-${idx + 1}`} className="ys-insight-card">
                  <div className="ys-insight-meta">
                    <span>{item.category}</span>
                    <span>{item.readTime}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <div className="ys-insight-takeaway">
                    <strong>{t('cases_page.labels.takeaway')}</strong> {item.takeaway}
                  </div>
                </article>
              ))}
          </div>
        </section>
      </div>

      <LeadCapture />
    </div>
  );
};
