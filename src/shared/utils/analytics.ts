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
  | 'language_change';

export function trackEvent(name: EventName, props?: Record<string, string | number | boolean | null>) {
  try {
    track(name, props);
  } catch {
    // silent — analytics nunca derruba UX
  }
}
