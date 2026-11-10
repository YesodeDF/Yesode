import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface SeoConfig {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords?: string[];
  jsonLd?: Record<string, any>[];
}

export const SeoHead: React.FC<SeoConfig> = ({
  title,
  description,
  canonicalUrl,
  keywords,
  jsonLd,
}) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Title
    document.title = title;

    // 2. Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. Keywords
    if (keywords && keywords.length > 0) {
      let metaKw = document.querySelector('meta[name="keywords"]');
      if (!metaKw) {
        metaKw = document.createElement('meta');
        metaKw.setAttribute('name', 'keywords');
        document.head.appendChild(metaKw);
      }
      metaKw.setAttribute('content', keywords.join(', '));
    }

    // 4. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // 5. OpenGraph Tags
    const updateOg = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateOg('og:title', title);
    updateOg('og:description', description);
    updateOg('og:url', canonicalUrl);

    // 6. JSON-LD Structured Data Injection
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
  }, [title, description, canonicalUrl, keywords, jsonLd, location.pathname]);

  return null;
};

