import fs from 'fs';
import path from 'path';
import {
  BASE_URL,
  LEGAL_SLUGS,
  STRATEGIC_SLUGS,
  SUPPORTED_LANGS,
  getHomeAlternates,
  getLegalAlternates,
  getStrategicAlternates,
  getStrategicPath,
  getToolAlternates,
  getToolPath,
  type AlternateLink,
  type StrategicPage,
  type ToolTab,
} from '../src/modules/landing/domain/ToolRoutes.ts';

interface SitemapEntry {
  loc: string;
  alternates: AlternateLink[];
  changefreq: 'daily' | 'weekly' | 'monthly';
  priority: string;
}

const today = new Date().toISOString().slice(0, 10);
const entries: SitemapEntry[] = [];

// 1. Homepages
for (const lang of SUPPORTED_LANGS) {
  entries.push({
    loc: `${BASE_URL}/${lang}`,
    alternates: getHomeAlternates(),
    changefreq: 'weekly',
    priority: lang === 'pt' ? '1.0' : '0.95',
  });
}

// 2. Strategic Commercial Journeys & Case Studies (Enterprise, Business, Cases)
const strategicPages: StrategicPage[] = ['enterprise', 'business', 'cases'];
for (const page of strategicPages) {
  for (const lang of SUPPORTED_LANGS) {
    entries.push({
      loc: `${BASE_URL}${getStrategicPath(lang, page)}`,
      alternates: getStrategicAlternates(page),
      changefreq: 'weekly',
      priority: page === 'cases' ? '0.9' : '0.95',
    });
  }
}

// 3. Free Tools Hub
for (const lang of SUPPORTED_LANGS) {
  entries.push({
    loc: `${BASE_URL}${getToolPath(lang)}`,
    alternates: getToolAlternates(),
    changefreq: 'weekly',
    priority: '0.85',
  });
}

// 4. Individual Free Tools
const toolTabs: ToolTab[] = ['qr', 'media', 'sticker'];
for (const tab of toolTabs) {
  for (const lang of SUPPORTED_LANGS) {
    entries.push({
      loc: `${BASE_URL}${getToolPath(lang, tab)}`,
      alternates: getToolAlternates(tab),
      changefreq: 'weekly',
      priority: '0.85',
    });
  }
}

// 5. Legal Pages
for (const type of ['privacy', 'terms'] as const) {
  for (const lang of SUPPORTED_LANGS) {
    entries.push({
      loc: `${BASE_URL}/${lang}/${LEGAL_SLUGS[type][lang]}`,
      alternates: getLegalAlternates(type),
      changefreq: 'monthly',
      priority: '0.3',
    });
  }
}

// Validate that STRATEGIC_SLUGS is referenced
void STRATEGIC_SLUGS;

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...entries.map((entry) => {
    const links = entry.alternates
      .map(
        (alt) =>
          `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}"/>`
      )
      .join('\n');
    return [
      '  <url>',
      `    <loc>${entry.loc}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      links,
      `    <changefreq>${entry.changefreq}</changefreq>`,
      `    <priority>${entry.priority}</priority>`,
      '  </url>',
    ].join('\n');
  }),
  '</urlset>',
  '',
].join('\n');

const outPath = path.resolve(process.cwd(), 'public/sitemap.xml');
fs.writeFileSync(outPath, xml, 'utf8');
console.log(`[sitemap] Generated ${entries.length} canonical URLs in public/sitemap.xml`);
