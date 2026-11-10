export class MediaDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MediaDomainError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnsupportedPlatformError extends MediaDomainError {
  constructor(message = 'Link não suportado. Aceitamos YouTube, X (Twitter), Instagram e Facebook.') {
    super(message);
  }
}

export class MediaSecurityError extends MediaDomainError {
  constructor(message = 'URL inválida ou tentativa de acesso não permitida.') {
    super(message);
  }
}

