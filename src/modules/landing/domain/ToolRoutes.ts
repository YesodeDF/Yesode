export type SupportedLang = 'pt' | 'en' | 'es';
export type ToolTab = 'qr' | 'media' | 'sticker';
export type StrategicPage = 'enterprise' | 'business' | 'cases';

export const BASE_URL = 'https://yesode.com';
export const DEFAULT_LANG: SupportedLang = 'pt';
export const SUPPORTED_LANGS: SupportedLang[] = ['pt', 'en', 'es'];

export const TOOL_HUB_SEGMENTS: Record<SupportedLang, string> = {
  pt: 'ferramentas',
  en: 'tools',
  es: 'herramientas',
};

export const TOOL_SLUGS: Record<ToolTab, Record<SupportedLang, string>> = {
  qr: {
    pt: 'gerador-qr-code-pix',
    en: 'qr-code-pix-generator',
    es: 'generador-codigo-qr-pix',
  },
  media: {
    pt: 'baixar-videos-youtube-redes-sociais',
    en: 'youtube-social-video-downloader',
    es: 'descargar-videos-youtube-redes-sociales',
  },
  sticker: {
    pt: 'criar-figurinha-whatsapp',
    en: 'whatsapp-sticker-maker',
    es: 'crear-stickers-whatsapp',
  },
};

export const LEGAL_SLUGS: Record<'privacy' | 'terms', Record<SupportedLang, string>> = {
  privacy: {
    pt: 'politica-de-privacidade',
    en: 'privacy-policy',
    es: 'politica-de-privacidad',
  },
  terms: {
    pt: 'termos-de-uso',
    en: 'terms-of-use',
    es: 'terminos-de-uso',
  },
};

export const STRATEGIC_SLUGS: Record<StrategicPage, Record<SupportedLang, string>> = {
  enterprise: {
    pt: 'enterprise',
    en: 'enterprise',
    es: 'enterprise',
  },
  business: {
    pt: 'business',
    en: 'business',
    es: 'business',
  },
  cases: {
    pt: 'cases',
    en: 'case-studies',
    es: 'casos-de-estudio',
  },
};

export function normalizeLang(lang?: string): SupportedLang {
  if (lang === 'en' || lang === 'es' || lang === 'pt') return lang;
  return DEFAULT_LANG;
}

export function getLocaleCode(lang: SupportedLang): string {
  if (lang === 'pt') return 'pt_BR';
  if (lang === 'en') return 'en_US';
  return 'es_ES';
}

export function getToolPath(lang: SupportedLang, tab?: ToolTab): string {
  const hub = TOOL_HUB_SEGMENTS[lang];
  if (!tab) return `/${lang}/${hub}`;
  return `/${lang}/${hub}/${TOOL_SLUGS[tab][lang]}`;
}

export function getStrategicPath(lang: SupportedLang, page: StrategicPage): string {
  return `/${lang}/${STRATEGIC_SLUGS[page][lang]}`;
}

export function getLegalPath(lang: SupportedLang, type: 'privacy' | 'terms'): string {
  return `/${lang}/${LEGAL_SLUGS[type][lang]}`;
}

export function getTabFromPathname(pathname: string): ToolTab {
  const normalized = pathname.toLowerCase();
  if (
    normalized.includes('baixar-videos') ||
    normalized.includes('media-downloader') ||
    normalized.includes('youtube-social-video-downloader') ||
    normalized.includes('descargar-videos')
  ) {
    return 'media';
  }
  if (
    normalized.includes('criar-figurinha-whatsapp') ||
    normalized.includes('whatsapp-sticker-maker') ||
    normalized.includes('crear-stickers-whatsapp')
  ) {
    return 'sticker';
  }
  return 'qr';
}

export interface AlternateLink {
  hreflang: string;
  href: string;
}

function withPtBrAndDefault(
  pathBuilder: (lang: SupportedLang) => string
): AlternateLink[] {
  const links: AlternateLink[] = [
    {
      hreflang: 'pt-BR',
      href: `${BASE_URL}${pathBuilder('pt')}`,
    },
    ...SUPPORTED_LANGS.map((l) => ({
      hreflang: l,
      href: `${BASE_URL}${pathBuilder(l)}`,
    })),
    {
      hreflang: 'x-default',
      href: `${BASE_URL}${pathBuilder(DEFAULT_LANG)}`,
    },
  ];
  return links;
}

export function getToolAlternates(tab?: ToolTab): AlternateLink[] {
  return withPtBrAndDefault((l) => getToolPath(l, tab));
}

export function getHomeAlternates(): AlternateLink[] {
  return withPtBrAndDefault((l) => `/${l}`);
}

export function getLegalAlternates(type: 'privacy' | 'terms'): AlternateLink[] {
  return withPtBrAndDefault((l) => getLegalPath(l, type));
}

export function getStrategicAlternates(page: StrategicPage): AlternateLink[] {
  return withPtBrAndDefault((l) => getStrategicPath(l, page));
}

/**
 * Translates any localized route pathname to its equivalent in `targetLang`.
 */
export function translateRoutePath(pathname: string, targetLang: SupportedLang): string {
  const clean = pathname.replace(/\/+$/, '');
  const parts = clean.split('/').filter(Boolean);

  if (parts.length === 0) {
    return `/${targetLang}`;
  }

  const hasLangPrefix = ['pt', 'en', 'es'].includes(parts[0]);
  const rest = hasLangPrefix ? parts.slice(1) : parts;

  if (rest.length === 0) {
    return `/${targetLang}`;
  }

  const first = rest[0].toLowerCase();

  // Check Tools Hub & specific tool tabs
  if (Object.values(TOOL_HUB_SEGMENTS).includes(first)) {
    if (rest.length === 1) {
      return getToolPath(targetLang);
    }
    const tab = getTabFromPathname(clean);
    return getToolPath(targetLang, tab);
  }

  // Check Legal routes
  if (Object.values(LEGAL_SLUGS.privacy).includes(first)) {
    return getLegalPath(targetLang, 'privacy');
  }
  if (Object.values(LEGAL_SLUGS.terms).includes(first)) {
    return getLegalPath(targetLang, 'terms');
  }

  // Check Strategic routes
  if (Object.values(STRATEGIC_SLUGS.enterprise).includes(first)) {
    return getStrategicPath(targetLang, 'enterprise');
  }
  if (Object.values(STRATEGIC_SLUGS.business).includes(first)) {
    return getStrategicPath(targetLang, 'business');
  }
  if (Object.values(STRATEGIC_SLUGS.cases).includes(first) || first === 'cases') {
    return getStrategicPath(targetLang, 'cases');
  }

  return `/${targetLang}/${rest.join('/')}`;
}
