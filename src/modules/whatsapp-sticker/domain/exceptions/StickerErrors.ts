export class StickerDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StickerDomainError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DurationExceededError extends StickerDomainError {
  constructor(message = 'O corte da figurinha não pode exceder 6 segundos (limite do WhatsApp).') {
    super(message);
  }
}

export class FileSizeLimitExceededError extends StickerDomainError {
  constructor(message = 'A figurinha animada gerada deve ter no máximo 500 KB para o WhatsApp aceitar.') {
    super(message);
  }
}

