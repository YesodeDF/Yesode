export type MediaErrorCode = 'unsupported_platform' | 'media_security' | 'media_domain_error';

export class MediaDomainError extends Error {
  public readonly code: MediaErrorCode;

  constructor(message: string, code: MediaErrorCode = 'media_domain_error') {
    super(message);
    this.name = 'MediaDomainError';
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnsupportedPlatformError extends MediaDomainError {
  constructor(message = 'Unsupported link. Accepted: YouTube, X (Twitter), Instagram, and Facebook.') {
    super(message, 'unsupported_platform');
  }
}

export class MediaSecurityError extends MediaDomainError {
  constructor(message = 'Invalid URL or blocked access attempt.') {
    super(message, 'media_security');
  }
}
