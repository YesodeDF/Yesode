import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { chromium, type Browser } from '@playwright/test';
import {
  BASE_URL,
  LEGAL_SLUGS,
  SUPPORTED_LANGS,
  getHomeAlternates,
  getLegalAlternates,
  getLegalPath,
  getLocaleCode,
  getStrategicAlternates,
  getStrategicPath,
  getToolAlternates,
  getToolPath,
  type StrategicPage,
  type SupportedLang,
  type ToolTab,
} from '../src/modules/landing/domain/ToolRoutes.ts';

const PORT = 4173;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const DIST_DIR = path.resolve(process.cwd(), 'dist');

function buildRoutesList(): string[] {
  const routes: string[] = [];
  const toolTabs: ToolTab[] = ['qr', 'media', 'sticker'];
  const strategicPages: StrategicPage[] = ['enterprise', 'business', 'cases'];

  for (const lang of SUPPORTED_LANGS) {
    routes.push(`/${lang}`);
    for (const page of strategicPages) {
      routes.push(getStrategicPath(lang, page));
    }
    routes.push(getToolPath(lang));
    for (const tab of toolTabs) {
      routes.push(getToolPath(lang, tab));
    }
    routes.push(getLegalPath(lang, 'privacy'));
    routes.push(getLegalPath(lang, 'terms'));
  }
  return routes;
}

async function waitForServer(url: string, timeoutMs = 20000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // Retry until preview server is ready
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Preview server did not start within ${timeoutMs}ms`);
}

async function launchAvailableBrowser(): Promise<Browser | null> {
  const attempts: Array<Parameters<typeof chromium.launch>[0]> = [
    { headless: true },
    { headless: true, channel: 'chrome' },
    { headless: true, channel: 'msedge' },
  ];

  for (const options of attempts) {
    try {
      return await chromium.launch(options);
    } catch {
      // Try next available browser binary
    }
  }
  return null;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getFallbackMetaForRoute(route: string): {
  lang: SupportedLang;
  localeCode: string;
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  alternates: Array<{ hreflang: string; href: string }>;
  semanticSummary: string;
} {
  const parts = route.replace(/^\/+/, '').split('/');
  const lang = (['pt', 'en', 'es'].includes(parts[0]) ? parts[0] : 'pt') as SupportedLang;
  const localeCode = getLocaleCode(lang);
  const locale = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), `src/shared/i18n/locales/${lang}.json`), 'utf8')
  );

  const slug = parts[1] || '';

  if (slug === 'enterprise') {
    return {
      lang,
      localeCode,
      title: locale.enterprise_page.seo_title,
      description: locale.enterprise_page.seo_desc,
      canonical: `${BASE_URL}${getStrategicPath(lang, 'enterprise')}`,
      ogImage: `${BASE_URL}/og-cover.png`,
      alternates: getStrategicAlternates('enterprise'),
      semanticSummary: `<h1>${escapeHtml(locale.enterprise_page.seo_title)}</h1><p>${escapeHtml(locale.enterprise_page.seo_desc)}</p>`,
    };
  }

  if (slug === 'business') {
    return {
      lang,
      localeCode,
      title: locale.business_page.seo_title,
      description: locale.business_page.seo_desc,
      canonical: `${BASE_URL}${getStrategicPath(lang, 'business')}`,
      ogImage: `${BASE_URL}/og-cover.png`,
      alternates: getStrategicAlternates('business'),
      semanticSummary: `<h1>${escapeHtml(locale.business_page.seo_title)}</h1><p>${escapeHtml(locale.business_page.seo_desc)}</p>`,
    };
  }

  if (['cases', 'case-studies', 'casos-de-estudio'].includes(slug)) {
    return {
      lang,
      localeCode,
      title: locale.cases_page.seo_title,
      description: locale.cases_page.seo_desc,
      canonical: `${BASE_URL}${getStrategicPath(lang, 'cases')}`,
      ogImage: `${BASE_URL}/og-cover.png`,
      alternates: getStrategicAlternates('cases'),
      semanticSummary: `<h1>${escapeHtml(locale.cases_page.seo_title)}</h1><p>${escapeHtml(locale.cases_page.seo_desc)}</p>`,
    };
  }

  if (Object.values(LEGAL_SLUGS.privacy).includes(slug)) {
    const title = `${locale.privacy.title}${locale.privacy.title_highlight} | Yesode`;
    return {
      lang,
      localeCode,
      title,
      description: locale.privacy.intro,
      canonical: `${BASE_URL}${getLegalPath(lang, 'privacy')}`,
      ogImage: `${BASE_URL}/og-cover.png`,
      alternates: getLegalAlternates('privacy'),
      semanticSummary: `<h1>${escapeHtml(title)}</h1><p>${escapeHtml(locale.privacy.intro)}</p>`,
    };
  }

  if (Object.values(LEGAL_SLUGS.terms).includes(slug)) {
    const title = `${locale.terms.title}${locale.terms.title_highlight} | Yesode`;
    return {
      lang,
      localeCode,
      title,
      description: locale.terms.intro_1,
      canonical: `${BASE_URL}${getLegalPath(lang, 'terms')}`,
      ogImage: `${BASE_URL}/og-cover.png`,
      alternates: getLegalAlternates('terms'),
      semanticSummary: `<h1>${escapeHtml(title)}</h1><p>${escapeHtml(locale.terms.intro_1)}</p>`,
    };
  }

  const isTools = parts.length >= 2 && ['ferramentas', 'tools', 'herramientas'].includes(slug);
  if (isTools) {
    let tab: ToolTab = 'qr';
    if (
      route.includes('baixar-videos') ||
      route.includes('youtube-social-video-downloader') ||
      route.includes('descargar-videos')
    ) {
      tab = 'media';
    } else if (
      route.includes('criar-figurinha') ||
      route.includes('whatsapp-sticker-maker') ||
      route.includes('crear-stickers')
    ) {
      tab = 'sticker';
    }
    const isHub = parts.length === 2;
    const ogMap: Record<ToolTab, string> = {
      qr: `${BASE_URL}/og-qr.png`,
      media: `${BASE_URL}/og-media.png`,
      sticker: `${BASE_URL}/og-sticker.png`,
    };
    const steps = (locale.tools?.guides?.[tab]?.steps || [])
      .map((s: { name: string; text: string }) => `<li><strong>${escapeHtml(s.name)}</strong>: ${escapeHtml(s.text)}</li>`)
      .join('');
    const faqs = (locale.tools?.guides?.[tab]?.faqs || [])
      .map((f: { q: string; a: string }) => `<dt>${escapeHtml(f.q)}</dt><dd>${escapeHtml(f.a)}</dd>`)
      .join('');

    return {
      lang,
      localeCode,
      title: isHub ? locale.tools.seo.hub_title : locale.tools.seo[`${tab}_title`],
      description: isHub ? locale.tools.seo.hub_desc : locale.tools.seo[`${tab}_desc`],
      canonical: `${BASE_URL}${isHub ? getToolPath(lang) : getToolPath(lang, tab)}`,
      ogImage: isHub ? `${BASE_URL}/og-cover.png` : ogMap[tab],
      alternates: isHub ? getToolAlternates() : getToolAlternates(tab),
      semanticSummary: `<h1>${escapeHtml(locale.tools.hero_title_1)} ${escapeHtml(locale.tools.hero_title_2)}</h1><p>${escapeHtml(locale.tools.hero_desc)}</p><ol>${steps}</ol><dl>${faqs}</dl>`,
    };
  }

  return {
    lang,
    localeCode,
    title: locale.seo.title,
    description: locale.seo.description,
    canonical: `${BASE_URL}${route}`,
    ogImage: `${BASE_URL}/og-cover.png`,
    alternates: getHomeAlternates(),
    semanticSummary: `<h1>${escapeHtml(locale.seo.title)}</h1><p>${escapeHtml(locale.seo.description)}</p>`,
  };
}

function writeStaticFallbackHtml(routes: string[]): void {
  const baseHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');

  for (const route of routes) {
    const meta = getFallbackMetaForRoute(route);
    const alternatesHtml = meta.alternates
      .map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`)
      .join('\n    ');

    let html = baseHtml
      .replace(/<html lang="[^"]*">/, `<html lang="${meta.lang}">`)
      .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)
      .replace(/<meta name="title" content="[^"]*"\s*\/>/, `<meta name="title" content="${escapeHtml(meta.title)}" />`)
      .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(meta.description)}" />`)
      .replace(/<link rel="alternate" hreflang="[^"]*" href="[^"]*"\s*\/>\s*/g, '')
      .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${meta.canonical}" />\n    ${alternatesHtml}`)
      .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${meta.canonical}" />`)
      .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeHtml(meta.title)}" />`)
      .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeHtml(meta.description)}" />`)
      .replace(/<meta property="og:image" content="[^"]*"\s*\/>/, `<meta property="og:image" content="${meta.ogImage}" />`)
      .replace(/<meta property="og:locale" content="[^"]*"\s*\/>/, `<meta property="og:locale" content="${meta.localeCode}" />`)
      .replace(/<meta name="twitter:url" content="[^"]*"\s*\/>/, `<meta name="twitter:url" content="${meta.canonical}" />`)
      .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`)
      .replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`)
      .replace(/<meta name="twitter:image" content="[^"]*"\s*\/>/, `<meta name="twitter:image" content="${meta.ogImage}" />`)
      .replace('<div id="root"></div>', `<div id="root"></div><noscript>${meta.semanticSummary}</noscript>`);

    const cleanRoute = route.replace(/^\/+/, '');
    const targetDir = path.join(DIST_DIR, cleanRoute);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
    console.log(`[prerender:meta] Saved ${route} -> dist/${cleanRoute}/index.html`);
  }
}

async function run(): Promise<void> {
  if (!fs.existsSync(DIST_DIR)) {
    throw new Error('dist directory does not exist. Run vite build first.');
  }

  const routes = buildRoutesList();
  const browser = await launchAvailableBrowser();

  if (!browser) {
    console.warn('[prerender] No headless Chromium binary available in this environment. Applying static SEO metadata prerender fallback.');
    writeStaticFallbackHtml(routes);
    return;
  }

  const server = spawn(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['vite', 'preview', '--port', String(PORT), '--host', '127.0.0.1', '--strictPort'],
    { stdio: 'ignore', shell: process.platform === 'win32' }
  );

  try {
    await waitForServer(ORIGIN);
    for (const route of routes) {
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto(`${ORIGIN}${route}`, { waitUntil: 'networkidle' });
      await page.waitForSelector('main#main', { timeout: 10000 });
      await page.waitForTimeout(350);

      const html = await page.content();
      const cleanRoute = route.replace(/^\/+/, '');
      const targetDir = path.join(DIST_DIR, cleanRoute);
      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');

      console.log(`[prerender:dom] Saved ${route} -> dist/${cleanRoute}/index.html`);
      await context.close();
    }
  } finally {
    await browser.close();
    server.kill('SIGTERM');
  }
}

run().catch((err) => {
  console.error('[prerender] Failed:', err);
  process.exit(1);
});
