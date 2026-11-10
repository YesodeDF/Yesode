import { track } from '@vercel/analytics';

type EventName =
  | 'cta_hero_primary_click'
  | 'cta_hero_secondary_click'
  | 'cta_header_click'
  | 'nav_link_click'
  | 'form_submit_attempt'
  | 'form_submit_success'
  | 'form_submit_error'
  | 'faq_open'
  | 'language_change'
  | 'tool_view'
  | 'tool_generate_pix'
  | 'tool_import_pix'
  | 'tool_download_media'
  | 'tool_generate_sticker'
  | 'ai_crawler_referral';

export function trackEvent(name: EventName, props?: Record<string, string | number | boolean | null>) {
  try {
    track(name, props);
  } catch {
    // silent — analytics nunca derruba UX
  }
}

// Detecção de referenciadores de IA (ChatGPT, Perplexity, Claude, Gemini)
export function checkAndTrackAiReferral(): void {
  try {
    const referrer = (document.referrer || '').toLowerCase();
    let aiSource: string | null = null;

    if (referrer.includes('openai.com') || referrer.includes('chatgpt.com')) aiSource = 'ChatGPT';
    else if (referrer.includes('perplexity.ai')) aiSource = 'Perplexity';
    else if (referrer.includes('claude.ai') || referrer.includes('anthropic.com')) aiSource = 'Claude';
    else if (referrer.includes('gemini.google.com')) aiSource = 'Gemini';

    if (aiSource) {
      trackEvent('ai_crawler_referral', { source: aiSource, landingPath: window.location.pathname });
    }
  } catch {
    // silent
  }
}

