import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Cpu, ArrowRight, ArrowLeft } from 'lucide-react';
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

interface ServiceItem {
  tag: string;
  title: string;
  problem: string;
  desc: string;
  deliverables: string[];
}

interface FaqItem {
  q: string;
  a: string;
}

export const BusinessPage: React.FC = () => {
  const { t } = useTranslation();
  const { lang: rawLang = 'pt' } = useParams<{ lang: string }>();
  const lang = normalizeLang(rawLang);
  const canonical = `${BASE_URL}${getStrategicPath(lang, 'business')}`;

  const services = t('business_page.services', { returnObjects: true }) as ServiceItem[];
  const faqs = t('business_page.faqs', { returnObjects: true }) as FaqItem[];
  const keywords = t('business_page.seo_keywords', { returnObjects: true }) as string[];

  const jsonLd: Record<string, any>[] = [
    {
      '@type': 'Service',
      '@id': `${canonical}#service`,
      name: t('business_page.seo_title'),
      serviceType: 'Business Process Automation, AI Solutions & Custom Business Systems',
      provider: {
        '@id': `${BASE_URL}/#organization`,
      },
      areaServed: ['BR', 'US', 'EU', 'LATAM'],
      description: t('business_page.seo_desc'),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Business Automation & AI Services',
        itemListElement: Array.isArray(services)
          ? services.map((s) => ({
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: s.title,
                description: s.desc,
              },
            }))
          : [],
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
          name: t('header.nav_business'),
          item: canonical,
        },
      ],
    },
  ];

  if (Array.isArray(faqs) && faqs.length > 0) {
    jsonLd.push({
      '@type': 'FAQPage',
      inLanguage: lang,
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
    });
  }

  return (
    <div className="ys-strategic-page">
      <SeoHead
        title={t('business_page.seo_title')}
        description={t('business_page.seo_desc')}
        canonicalUrl={canonical}
        keywords={Array.isArray(keywords) ? keywords : []}
        locale={getLocaleCode(lang)}
        lang={lang}
        alternates={getStrategicAlternates('business')}
        jsonLd={jsonLd}
      />

      <div className="container">
        <nav className="ys-strategic-breadcrumb" aria-label="Breadcrumb">
          <Link to={`/${lang}`}>
            <ArrowLeft size={14} />
            <span>{t('tools.seo.breadcrumb_home')}</span>
          </Link>
          <span>/</span>
          <span className="ys-breadcrumb-current">{t('header.nav_business')}</span>
        </nav>

        <header className="ys-strategic-hero">
          <div className="ys-strategic-badge">
            <Cpu size={14} />
            <span>{t('business_page.badge')}</span>
          </div>
          <h1 className="ys-strategic-title">
            {t('business_page.title_1')}{' '}
            <span className="gradient-text-gold">{t('business_page.title_highlight')}</span>
          </h1>
          <p className="ys-strategic-subtitle">{t('business_page.subtitle')}</p>

          <div className="ys-strategic-actions">
            <button
              type="button"
              className="ys-strategic-btn-primary"
              onClick={() => scrollToSection('contact')}
            >
              <span>{t('business_page.cta_primary')}</span>
              <ArrowRight size={16} />
            </button>
            <Link to={getStrategicPath(lang, 'cases')} className="ys-strategic-btn-secondary">
              <span>{t('business_page.cta_secondary')}</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </header>

        <section className="ys-strategic-section">
          <div className="ys-strategic-section-head">
            <span className="ys-eyebrow">{t('business_page.services_eyebrow')}</span>
            <h2 className="ys-strategic-section-title">{t('business_page.services_title')}</h2>
            <p className="ys-strategic-section-desc">{t('business_page.services_desc')}</p>
          </div>

          <div className="ys-services-grid">
            {Array.isArray(services) &&
              services.map((s, idx) => (
                <article key={idx} className="ys-service-card">
                  <span className="ys-service-tag">{s.tag}</span>
                  <h3 className="ys-service-title">{s.title}</h3>
                  <p className="ys-service-problem">{s.problem}</p>
                  <p className="ys-service-desc">{s.desc}</p>
                  <ul className="ys-service-deliverables">
                    {Array.isArray(s.deliverables) &&
                      s.deliverables.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </article>
              ))}
          </div>
        </section>

        <section className="ys-strategic-section">
          <div className="ys-strategic-section-head">
            <span className="ys-eyebrow">FAQ Business & SMB</span>
            <h2 className="ys-strategic-section-title">{t('business_page.faq_title')}</h2>
          </div>

          <div className="ys-strategic-faq-list">
            {Array.isArray(faqs) &&
              faqs.map((f, idx) => (
                <details key={idx} open={idx === 0}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
          </div>
        </section>

        <div className="ys-interlink-banner">
          <div>
            <h3>{t('business_page.crosslink_title')}</h3>
            <p>{t('business_page.crosslink_desc')}</p>
          </div>
          <Link to={getStrategicPath(lang, 'enterprise')} className="ys-strategic-btn-secondary">
            <span>{t('business_page.crosslink_cta')}</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <LeadCapture />
    </div>
  );
};
