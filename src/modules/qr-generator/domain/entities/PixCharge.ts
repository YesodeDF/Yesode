import { PixKey } from '../value-objects/PixKey.ts';
import { QrDomainError, InvalidCrc16Error } from '../exceptions/QrErrors.ts';

export interface PixChargeProps {
  key: PixKey;
  merchantName: string;
  merchantCity: string;
  amount?: number;
  txId: string;
}

export class PixCharge {
  private readonly _props: PixChargeProps;

  private constructor(props: PixChargeProps) {
    this._props = props;
  }

  public static create(raw: {
    key: string;
    merchantName: string;
    merchantCity: string;
    amount?: number | string;
    txId?: string;
  }): PixCharge {
    const key = PixKey.create(raw.key);

    const rawName = (raw.merchantName || '').trim();
    if (!rawName) {
      throw new QrDomainError('O nome do recebedor (beneficiário) é obrigatório.');
    }
    // BACEN: até 25 caracteres, remover caracteres especiais e acentos
    const sanitizedName = rawName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .substring(0, 25);

    const rawCity = (raw.merchantCity || '').trim();
    if (!rawCity) {
      throw new QrDomainError('A cidade do recebedor é obrigatória.');
    }
    // BACEN: até 15 caracteres
    const sanitizedCity = rawCity
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .substring(0, 15);

    let amountNum: number | undefined;
    if (raw.amount !== undefined && raw.amount !== null && raw.amount !== '') {
      const valStr = typeof raw.amount === 'number' ? raw.amount.toString() : raw.amount.replace(',', '.').trim();
      const parsed = parseFloat(valStr);
      if (isNaN(parsed) || parsed < 0) {
        throw new QrDomainError('O valor informado para o Pix é inválido.');
      }
      if (parsed > 0) {
        amountNum = Math.round(parsed * 100) / 100;
      }
    }

    const rawTxId = (raw.txId || '***').trim();
    const sanitizedTxId = rawTxId
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 25) || '***';

    return new PixCharge({
      key,
      merchantName: sanitizedName,
      merchantCity: sanitizedCity,
      amount: amountNum,
      txId: sanitizedTxId,
    });
  }

  private static formatTlv(id: string, value: string): string {
    const len = value.length.toString().padStart(2, '0');
    return `${id}${len}${value}`;
  }

  public static calculateCrc16(payload: string): string {
    const payloadWithCrcTag = `${payload}6304`;
    let crc = 0xFFFF;
    const polynomial = 0x1021;

    for (let i = 0; i < payloadWithCrcTag.length; i++) {
      const byte = payloadWithCrcTag.charCodeAt(i);
      crc ^= (byte << 8);
      for (let bit = 0; bit < 8; bit++) {
        if ((crc & 0x8000) !== 0) {
          crc = ((crc << 1) ^ polynomial) & 0xFFFF;
        } else {
          crc = (crc << 1) & 0xFFFF;
        }
      }
    }

    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  public toEmvPayload(): string {
    const merchantAccountInfo = `0014BR.GOV.BCB.PIX01${this._props.key.value.length.toString().padStart(2, '0')}${this._props.key.value}`;

    const parts: string[] = [
      PixCharge.formatTlv('00', '01'),
      PixCharge.formatTlv('26', merchantAccountInfo),
      PixCharge.formatTlv('52', '0000'),
      PixCharge.formatTlv('53', '986'), // BRL
    ];

    if (this._props.amount && this._props.amount > 0) {
      parts.push(PixCharge.formatTlv('54', this._props.amount.toFixed(2)));
    }

    parts.push(PixCharge.formatTlv('58', 'BR'));
    parts.push(PixCharge.formatTlv('59', this._props.merchantName));
    parts.push(PixCharge.formatTlv('60', this._props.merchantCity));

    const additionalData = PixCharge.formatTlv('05', this._props.txId);
    parts.push(PixCharge.formatTlv('62', additionalData));

    const payloadWithoutCrc = parts.join('');
    const crc = PixCharge.calculateCrc16(payloadWithoutCrc);

    return `${payloadWithoutCrc}6304${crc}`;
  }

  public static parseFromCopyPaste(rawString: string): {
    key: string;
    merchantName: string;
    merchantCity: string;
    amount?: string;
    txId?: string;
    rawPayload?: string;
    isDynamic?: boolean;
  } {
    const clean = (rawString || '').trim().replace(/\s+/g, '');
    if (!clean.startsWith('000201')) {
      throw new QrDomainError('Código Pix Copia e Cola inválido: deve iniciar com "000201".');
    }

    // Validação de CRC16
    const crcIndex = clean.lastIndexOf('6304');
    if (crcIndex === -1 || crcIndex + 8 !== clean.length) {
      throw new InvalidCrc16Error('Código Pix incompleto ou sem checksum CRC16.');
    }

    const payloadWithoutCrc = clean.substring(0, crcIndex);
    const expectedCrc = clean.substring(crcIndex + 4);
    const calculatedCrc = PixCharge.calculateCrc16(payloadWithoutCrc);

    if (expectedCrc.toUpperCase() !== calculatedCrc.toUpperCase()) {
      throw new InvalidCrc16Error(`Checksum CRC16 divergente. Esperado: ${calculatedCrc}, Recebido: ${expectedCrc}`);
    }

    const dataMap: Record<string, string> = {};
    let i = 0;
    while (i < payloadWithoutCrc.length) {
      const id = payloadWithoutCrc.substring(i, i + 2);
      const len = parseInt(payloadWithoutCrc.substring(i + 2, i + 4), 10);
      if (isNaN(len)) break;
      const val = payloadWithoutCrc.substring(i + 4, i + 4 + len);
      dataMap[id] = val;
      i += 4 + len;
    }

    let chave = '';
    let isDynamic = false;
    if (dataMap['26']) {
      const sub26 = dataMap['26'];
      let k = 0;
      while (k < sub26.length) {
        const subId = sub26.substring(k, k + 2);
        const subLen = parseInt(sub26.substring(k + 2, k + 4), 10);
        if (isNaN(subLen)) break;
        const subVal = sub26.substring(k + 4, k + 4 + subLen);
        if (subId === '01') {
          chave = subVal;
          break;
        } else if (subId === '25') {
          // Pix Dinâmico (URL BACEN)
          chave = subVal;
          isDynamic = true;
          break;
        }
        k += 4 + subLen;
      }
    }

    let txId = '***';
    if (dataMap['62']) {
      const sub62 = dataMap['62'];
      let k = 0;
      while (k < sub62.length) {
        const subId = sub62.substring(k, k + 2);
        const subLen = parseInt(sub62.substring(k + 2, k + 4), 10);
        if (isNaN(subLen)) break;
        const subVal = sub62.substring(k + 4, k + 4 + subLen);
        if (subId === '05') {
          txId = subVal;
          break;
        }
        k += 4 + subLen;
      }
    }

    return {
      key: chave,
      merchantName: dataMap['59'] || '',
      merchantCity: dataMap['60'] || '',
      amount: dataMap['54'] || '',
      txId,
      rawPayload: clean,
      isDynamic,
    };
  }

  public get key(): PixKey {
    return this._props.key;
  }

  public get merchantName(): string {
    return this._props.merchantName;
  }

  public get merchantCity(): string {
    return this._props.merchantCity;
  }

  public get amount(): number | undefined {
    return this._props.amount;
  }

  public get txId(): string {
    return this._props.txId;
  }
}
