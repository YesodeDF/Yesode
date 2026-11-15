export type StickerErrorCode = 'duration_exceeded' | 'file_size_exceeded' | 'invalid_trim_interval' | 'sticker_domain_error';

export class StickerDomainError extends Error {
  public readonly code: StickerErrorCode;

  constructor(message: string, code: StickerErrorCode = 'sticker_domain_error') {
    super(message);
    this.name = 'StickerDomainError';
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DurationExceededError extends StickerDomainError {
  constructor(message = 'Sticker duration cannot exceed 6 seconds (WhatsApp limit).') {
    super(message, 'duration_exceeded');
  }
}

export class FileSizeLimitExceededError extends StickerDomainError {
  constructor(message = 'Generated animated sticker must be under 500 KB for WhatsApp.') {
    super(message, 'file_size_exceeded');
  }
}
