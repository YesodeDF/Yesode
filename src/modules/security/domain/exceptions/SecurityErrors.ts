export class SecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SecurityError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class RateLimitExceededError extends SecurityError {
  public readonly retryAfterSeconds: number;
  constructor(retryAfterSeconds = 60, message = 'Muitas requisições em pouco tempo. Por favor, aguarde alguns instantes.') {
    super(message);
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class BotDetectedError extends SecurityError {
  constructor(message = 'Comportamento automatizado detectado. Acesso recusado.') {
    super(message);
  }
}

export class UnauthorizedError extends SecurityError {
  constructor(message = 'Acesso não autorizado ou token inválido.') {
    super(message);
  }
}

