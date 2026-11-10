import { BotDetectedError } from '../exceptions/SecurityErrors.ts';

export interface BotTrapPayload {
  honeypot?: string;
  submitTimeDeltaMs?: number;
}

export class BotTrapValidator {
  public static readonly MIN_FILL_TIME_MS = 1800; // Humano leva pelo menos 1.8s para digitar nome, email e empresa

  public static validate(payload: BotTrapPayload): void {
    // 1. Honeypot check: campo invisível preenchido por scraper/bot
    if (payload.honeypot && payload.honeypot.trim().length > 0) {
      throw new BotDetectedError('Bot signature match (honeypot trap triggered).');
    }

    // 2. Time-trap check: formulário submetido em milissegundos
    if (payload.submitTimeDeltaMs !== undefined && payload.submitTimeDeltaMs < BotTrapValidator.MIN_FILL_TIME_MS) {
      throw new BotDetectedError('Bot signature match (sub-second form fill).');
    }
  }
}
