export class HtmlSanitizer {
  private static readonly ESCAPE_MAP: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  public static escape(input: unknown): string {
    if (input === null || input === undefined) return '';
    const str = String(input);
    return str.replace(/[&<>"'/]/g, (char) => HtmlSanitizer.ESCAPE_MAP[char] || char);
  }

  public static sanitizeObject<T extends Record<string, any>>(obj: T): T {
    const result: any = Array.isArray(obj) ? [] : {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (typeof val === 'string') {
        result[key] = HtmlSanitizer.escape(val);
      } else if (typeof val === 'object' && val !== null) {
        result[key] = HtmlSanitizer.sanitizeObject(val);
      } else {
        result[key] = val;
      }
    }
    return result;
  }
}

