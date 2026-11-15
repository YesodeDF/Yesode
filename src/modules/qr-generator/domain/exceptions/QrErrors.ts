export type QrErrorCode = 'invalid_pix_key' | 'invalid_crc16' | 'invalid_pix_payload' | 'qr_domain_error';

export class QrDomainError extends Error {
  public readonly code: QrErrorCode;

  constructor(message: string, code: QrErrorCode = 'qr_domain_error') {
    super(message);
    this.name = 'QrDomainError';
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidPixKeyError extends QrDomainError {
  constructor(message = 'Invalid Pix key.') {
    super(message, 'invalid_pix_key');
  }
}

export class InvalidCrc16Error extends QrDomainError {
  constructor(message = 'Invalid CRC16 checksum in EMV payload.') {
    super(message, 'invalid_crc16');
  }
}
