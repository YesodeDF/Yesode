export class QrDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QrDomainError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidPixKeyError extends QrDomainError {
  constructor(message = 'Chave Pix inválida.') {
    super(message);
  }
}

export class InvalidCrc16Error extends QrDomainError {
  constructor(message = 'Assinatura CRC16 inválida no payload EMV.') {
    super(message);
  }
}

