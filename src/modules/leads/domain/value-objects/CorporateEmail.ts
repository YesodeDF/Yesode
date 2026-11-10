import { DomainError } from '../exceptions/LeadErrors.ts';

export const BLOCKED_EMAIL_DOMAINS = new Set([
  'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'yahoo.com.br',
  'live.com', 'msn.com', 'icloud.com', 'me.com', 'proton.me', 'protonmail.com',
  'bol.com.br', 'uol.com.br', 'terra.com.br', 'ig.com.br'
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export class CorporateEmail {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(raw: string): CorporateEmail {
    const trimmed = (raw || '').trim().toLowerCase();
    if (!trimmed) {
      throw new DomainError('O e-mail corporativo é obrigatório.');
    }
    if (!EMAIL_RE.test(trimmed)) {
      throw new DomainError('Formato de e-mail inválido.');
    }
    const domain = trimmed.split('@')[1];
    if (BLOCKED_EMAIL_DOMAINS.has(domain)) {
      throw new DomainError('Por favor, utilize seu e-mail corporativo (não pessoal).');
    }
    return new CorporateEmail(trimmed);
  }

  public get value(): string {
    return this._value;
  }

  public get domain(): string {
    return this._value.split('@')[1];
  }
}
