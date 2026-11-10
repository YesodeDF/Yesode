import { DurationExceededError, StickerDomainError } from '../exceptions/StickerErrors.ts';

export class StickerSpec {
  public static readonly TARGET_DIMENSION = 512; // 512x512 px padrão WhatsApp
  public static readonly MAX_DURATION_SECONDS = 6.0;
  public static readonly MAX_SIZE_BYTES = 500 * 1024; // 500 KB teto estrito

  private readonly _startTime: number;
  private readonly _endTime: number;
  private readonly _cropMode: 'square_crop' | 'fit_pad';

  private constructor(startTime: number, endTime: number, cropMode: 'square_crop' | 'fit_pad') {
    this._startTime = startTime;
    this._endTime = endTime;
    this._cropMode = cropMode;
  }

  public static create(startTime = 0, endTime = 3, cropMode: 'square_crop' | 'fit_pad' = 'fit_pad'): StickerSpec {
    if (startTime < 0 || endTime <= startTime) {
      throw new StickerDomainError('Intervalo de corte inválido.');
    }
    const duration = endTime - startTime;
    if (duration > this.MAX_DURATION_SECONDS) {
      throw new DurationExceededError();
    }
    return new StickerSpec(startTime, endTime, cropMode);
  }

  public get startTime(): number {
    return this._startTime;
  }

  public get endTime(): number {
    return this._endTime;
  }

  public get duration(): number {
    return this._endTime - this._startTime;
  }

  public get cropMode(): 'square_crop' | 'fit_pad' {
    return this._cropMode;
  }
}
