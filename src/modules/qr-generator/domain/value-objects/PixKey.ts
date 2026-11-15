import { InvalidPixKeyError } from '../exceptions/QrErrors.ts';

export type PixKeyType = 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';

export class PixKey {
  private readonly _value: string;
  private readonly _type: PixKeyType;

  private constructor(value: string, type: PixKeyType) {
    this._value = value;
    this._type = type;
  }

  public static create(raw: string): PixKey {
    const clean = (raw || '').trim();
    if (!clean) {
      throw new InvalidPixKeyError('Pix key cannot be empty.');
    }

    const digitsOnly = clean.replace(/\D/g, '');

    if (digitsOnly.length === 11 && !clean.includes('@') && !clean.startsWith('+')) {
      return new PixKey(digitsOnly, 'cpf');
    }

    if (digitsOnly.length === 14 && !clean.includes('@')) {
      return new PixKey(digitsOnly, 'cnpj');
    }

    if ((clean.startsWith('+') || digitsOnly.length === 10 || digitsOnly.length === 11) && !clean.includes('@')) {
      const phoneDigits = digitsOnly.startsWith('55') ? digitsOnly : `55${digitsOnly}`;
      return new PixKey(`+${phoneDigits}`, 'phone');
    }

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      return new PixKey(clean.toLowerCase(), 'email');
    }

    if (/^[0-9a-fA-F-]{32,36}$/.test(clean) || clean.length >= 32) {
      return new PixKey(clean, 'random');
    }

    return new PixKey(clean, 'random');
  }

  public get value(): string {
    return this._value;
  }

  public get type(): PixKeyType {
    return this._type;
  }
}
