import fs from 'fs';
import path from 'path';

const langs = ['pt', 'en', 'es'] as const;

function collectKeys(obj: unknown, prefix = ''): string[] {
  if (Array.isArray(obj)) {
    return obj.flatMap((item, idx) => collectKeys(item, `${prefix}[${idx}]`));
  }
  if (obj && typeof obj === 'object') {
    return Object.entries(obj).flatMap(([k, v]) =>
      collectKeys(v, prefix ? `${prefix}.${k}` : k)
    );
  }
  return [prefix];
}

const maps: Record<string, Set<string>> = {};
for (const lang of langs) {
  const filePath = path.resolve(process.cwd(), `src/shared/i18n/locales/${lang}.json`);
  const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  maps[lang] = new Set(collectKeys(parsed));
}

const allKeys = new Set<string>([...maps.pt, ...maps.en, ...maps.es]);
let hasErrors = false;

for (const lang of langs) {
  const missing = [...allKeys].filter((k) => !maps[lang].has(k));
  if (missing.length > 0) {
    hasErrors = true;
    console.error(`[i18n] Missing ${missing.length} keys in ${lang}.json:`, missing.slice(0, 20));
  }
}

if (hasErrors) {
  process.exit(1);
}

console.log(`[i18n] OK: All ${allKeys.size} keys match across pt, en, and es.`);
