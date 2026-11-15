import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { AlternateLink } from '@/modules/landing/domain/ToolRoutes.ts';

export interface SeoConfig {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords?: string[];
  ogImage?: string;
  locale?: string;
  lang?: string;
  alternates?: AlternateLink[];
  jsonLd?: Record<string, any>[];
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
        document.head.appendChild(link);
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
    if (scriptTag) {
      scriptTag.remove();
    }

    if (jsonLd && jsonLd.length > 0) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      scriptTag.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': jsonLd,
      });
      document.head.appendChild(scriptTag);
    }

    return () => {
      const tag = document.getElementById(scriptId);
      if (tag) tag.remove();
    };
  }, [title, description, canonicalUrl, keywords, ogImage, locale, lang, alternates, jsonLd, location.pathname]);

  return null;
};
