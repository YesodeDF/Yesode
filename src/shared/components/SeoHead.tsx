import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BASE_URL, type AlternateLink, type SupportedLang } from '@/modules/landing/domain/ToolRoutes.ts';

export interface SeoConfig {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords?: string[];
  ogImage?: string;
  locale?: string;
  lang?: SupportedLang | string;
  alternates?: AlternateLink[];
  jsonLd?: Record<string, any>[];
}

export function getBaseOrganizationSchema(lang: string = 'pt'): Record<string, any> {
  const descriptions: Record<string, string> = {
    pt: 'Consultoria de engenharia de software corporativa, arquitetura de sistemas críticos, modernização de legados, integração ERP/CRM e automação com inteligência artificial.',
    en: 'Enterprise software engineering consultancy, mission-critical systems architecture, legacy modernization, ERP/CRM integration, and AI business automation.',
    es: 'Consultoría de ingeniería de software corporativa, arquitectura de sistemas críticos, modernización de legados, integración ERP/CRM y automatización con inteligencia artificial.',
  };

  return {
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'Yesode',
    legalName: 'YESODE CONSULTORIA E SERVIÇOS DE TECNOLOGIA LTDA',
    taxID: '53.649.336/0001-38',
    url: `${BASE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/logo.svg`,
    },
    description: descriptions[lang] || descriptions.pt,
    knowsAbout: [
      'Software Engineering',
      'Enterprise Software Architecture',
      'Legacy System Modernization',
      'Artificial Intelligence',
      'Business Process Automation',
      'ERP and CRM System Integration',
      'Cloud Infrastructure and Kubernetes',
      'DORA Metrics and Observability',
    ],
    sameAs: [
      'https://www.linkedin.com/company/yesode',
      'https://github.com/YesodeDF',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: 'contato@yesode.com',
        availableLanguage: ['Portuguese', 'English', 'Spanish'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'technical support',
        email: 'dpo@yesode.com.br',
        availableLanguage: ['Portuguese', 'English', 'Spanish'],
      },
    ],
  };
}

export function getBaseWebSiteSchema(lang: string = 'pt'): Record<string, any> {
  const inLangMap: Record<string, string> = {
    pt: 'pt-BR',
    en: 'en-US',
    es: 'es-ES',
  };

  return {
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: 'Yesode',
    url: `${BASE_URL}/${lang}`,
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    inLanguage: inLangMap[lang] || 'pt-BR',
  };
}

export const SeoHead: React.FC<SeoConfig> = ({
  title,
  description,
  canonicalUrl,
  keywords,
  ogImage = 'https://yesode.com/og-cover.png',
  locale = 'pt_BR',
  lang = 'pt',
  alternates,
  jsonLd,
}) => {
  const location = useLocation();

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = title;

    const upsertMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let tag = document.querySelector(`meta[${attr}="${key}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    upsertMeta('name', 'title', title);
    upsertMeta('name', 'description', description);
    if (keywords && keywords.length > 0) {
      upsertMeta('name', 'keywords', keywords.join(', '));
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    if (alternates && alternates.length > 0) {
      document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
      alternates.forEach(({ hreflang, href }) => {
        const link = document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', hreflang);
        link.setAttribute('href', href);
        canonical?.insertAdjacentElement('afterend', link);
      });
    }

    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:locale', locale);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:url', canonicalUrl);
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', ogImage);

    const scriptId = 'yesode-dynamic-seo-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const hasOrg = jsonLd?.some((item) => item['@type'] === 'Organization');
    const hasWebSite = jsonLd?.some((item) => item['@type'] === 'WebSite');
    const graph: Record<string, any>[] = [];

    if (!hasOrg) {
      graph.push(getBaseOrganizationSchema(lang));
    }
    if (!hasWebSite) {
      graph.push(getBaseWebSiteSchema(lang));
    }
    if (jsonLd && jsonLd.length > 0) {
      graph.push(...jsonLd);
    }

    scriptTag.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': graph,
    });
  }, [title, description, canonicalUrl, keywords, ogImage, locale, lang, alternates, jsonLd, location.pathname]);

  return null;
};
