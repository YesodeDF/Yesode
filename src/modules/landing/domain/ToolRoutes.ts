export type SupportedLang = 'pt' | 'en' | 'es';
export type ToolTab = 'qr' | 'media' | 'sticker';

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

export function normalizeLang(lang?: string): SupportedLang {
  if (lang === 'en' || lang === 'es' || lang === 'pt') return lang;
  return DEFAULT_LANG;
}

export function getToolPath(lang: SupportedLang, tab?: ToolTab): string {
  const hub = TOOL_HUB_SEGMENTS[lang];
  if (!tab) return `/${lang}/${hub}`;
  return `/${lang}/${hub}/${TOOL_SLUGS[tab][lang]}`;
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

export function getToolAlternates(tab?: ToolTab): AlternateLink[] {
  const links: AlternateLink[] = SUPPORTED_LANGS.map((l) => ({
    hreflang: l,
    href: `${BASE_URL}${getToolPath(l, tab)}`,
  }));
  links.push({
    hreflang: 'x-default',
    href: `${BASE_URL}${getToolPath(DEFAULT_LANG, tab)}`,
  });
  return links;
}

export function getHomeAlternates(): AlternateLink[] {
  const links: AlternateLink[] = SUPPORTED_LANGS.map((l) => ({
    hreflang: l,
    href: `${BASE_URL}/${l}`,
  }));
  links.push({
    hreflang: 'x-default',
    href: `${BASE_URL}/${DEFAULT_LANG}`,
  });
  return links;
}

export function getLegalAlternates(type: 'privacy' | 'terms'): AlternateLink[] {
  const links: AlternateLink[] = SUPPORTED_LANGS.map((l) => ({
    hreflang: l,
    href: `${BASE_URL}/${l}/${LEGAL_SLUGS[type][l]}`,
  }));
  links.push({
    hreflang: 'x-default',
    href: `${BASE_URL}/${DEFAULT_LANG}/${LEGAL_SLUGS[type][DEFAULT_LANG]}`,
  });
  return links;
}
