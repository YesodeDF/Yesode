/**
 * Serviço de infraestrutura para geração de Metadados EXIF oficiais do WhatsApp em arquivos WebP.
 * O WhatsApp exige que figurinhas (stickers) contenham um chunk 'EXIF' dentro do contêiner RIFF/WebP
 * com a tag de identificação 0x5741 ("AW") e o payload JSON codificado em UTF-8.
 * Sem esse chunk EXIF, o WhatsApp trata o WebP como imagem comum, sem habilitar o comportamento nativo de figurinha.
 */

export interface StickerMetadata {
  packName?: string;
  authorName?: string;
  emojis?: string[];
}

export class WhatsAppStickerExifService {
  /**
   * Constrói o payload binário TIFF Little-Endian que o WhatsApp reconhece.
   */
  public static createTiffExifPayload(metadata: StickerMetadata = {}): Uint8Array {
    const pack = metadata.packName || 'Yesode Stickers';
    const author = metadata.authorName || 'Yesode House Coding';
    const emojis = metadata.emojis && metadata.emojis.length > 0 ? metadata.emojis : ['✨', '🚀'];

    const json = JSON.stringify({
      'sticker-pack-id': `yesode-${Date.now()}`,
      'sticker-pack-name': pack,
      'sticker-pack-publisher': author,
      'emojis': emojis,
      'android-app-store-link': 'https://yesode.com.br',
      'ios-app-store-link': 'https://yesode.com.br',
    });

    const jsonBytes = new TextEncoder().encode(json);
    const jsonLen = jsonBytes.length;

    // Cabeçalho TIFF:
    // 0x49, 0x49: "II" (Intel Little-Endian)
    // 0x2A, 0x00: Marcador TIFF 42
    // 0x08, 0x00, 0x00, 0x00: Offset do 1º IFD (8 bytes após o início)
    // 0x01, 0x00: Contagem de diretórios (1 tag)
    // Tag AW (0x41, 0x57): Tag proprietária do WhatsApp
    // 0x07, 0x00: Tipo 7 (UNDEFINED)
    // 4 bytes: Tamanho dos dados JSON
    // 4 bytes: Offset dos dados JSON a partir do início do TIFF = 8 + 2 + 12 + 4 = 26 (0x1A)
    // 4 bytes: Próximo IFD = 0x00, 0x00, 0x00, 0x00 (sem outros IFDs)
    const tiffHeader = new Uint8Array([
      0x49, 0x49, 0x2A, 0x00,
      0x08, 0x00, 0x00, 0x00,
      0x01, 0x00,
      0x41, 0x57,
      0x07, 0x00,
      jsonLen & 0xFF, (jsonLen >> 8) & 0xFF, (jsonLen >> 16) & 0xFF, (jsonLen >> 24) & 0xFF,
      0x1A, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
    ]);

    const exifPayload = new Uint8Array(tiffHeader.length + jsonLen);
    exifPayload.set(tiffHeader, 0);
    exifPayload.set(jsonBytes, tiffHeader.length);

    return exifPayload;
  }

  /**
   * Injeta o chunk EXIF dentro do buffer de imagem WebP, garantindo contêiner estendido com VP8X.
   */
  public static injectWhatsAppExif(webpBuffer: ArrayBuffer, metadata?: StickerMetadata): ArrayBuffer {
    const view = new DataView(webpBuffer);
    const bytes = new Uint8Array(webpBuffer);

    // Validação do cabeçalho RIFF/WEBP
    const riff = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
    const webp = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
    if (riff !== 'RIFF' || webp !== 'WEBP') {
      throw new Error('Arquivo fornecido não é um WebP válido.');
    }

    const exifPayload = this.createTiffExifPayload(metadata);
    const chunks: { fourcc: string; data: Uint8Array }[] = [];

    let offset = 12;
    let hasVp8x = false;

    while (offset < bytes.length) {
      if (offset + 8 > bytes.length) break;

      const fourcc = String.fromCharCode(bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3]);
      const chunkSize = view.getUint32(offset + 4, true);
      const paddedSize = chunkSize + (chunkSize % 2);
      const payload = bytes.subarray(offset + 8, offset + 8 + chunkSize);

      if (fourcc === 'EXIF') {
        // Remove EXIF legado, se houver
      } else if (fourcc === 'VP8X') {
        hasVp8x = true;
        const modified = new Uint8Array(payload);
        // Ativa flag de Exif (bit 3: 0x08)
        modified[0] |= 0x08;
        chunks.push({ fourcc, data: modified });
      } else {
        chunks.push({ fourcc, data: payload });
      }

      offset += 8 + paddedSize;
    }

    // Se o WebP não possui chunk VP8X (ex: gerado por Canvas toDataURL como VP8 simples),
    // criamos o cabeçalho estendido VP8X de 10 bytes:
    if (!hasVp8x) {
      const vp8xData = new Uint8Array(10);
      // Bit 3 (0x08) = Exif, Bit 4 (0x10) = Alpha/Transparência -> 0x18
      vp8xData[0] = 0x18;
      // Dimensões da tela do Canvas (512 - 1 = 511 -> 0x01FF em 24-bit uint LE):
      vp8xData[4] = 0xFF;
      vp8xData[5] = 0x01;
      vp8xData[6] = 0x00;
      vp8xData[7] = 0xFF;
      vp8xData[8] = 0x01;
      vp8xData[9] = 0x00;

      chunks.unshift({ fourcc: 'VP8X', data: vp8xData });
    }

    // Insere o chunk EXIF
    chunks.push({ fourcc: 'EXIF', data: exifPayload });

    // Calcula o tamanho total do contêiner RIFF
    let totalPayloadSize = 4; // 'WEBP'
    for (const chunk of chunks) {
      const pLen = chunk.data.length;
      totalPayloadSize += 8 + pLen + (pLen % 2);
    }

    const outBuffer = new ArrayBuffer(8 + totalPayloadSize);
    const outView = new DataView(outBuffer);
    const outBytes = new Uint8Array(outBuffer);

    // Escreve cabeçalho RIFF
    outBytes.set([0x52, 0x49, 0x46, 0x46], 0); // 'RIFF'
    outView.setUint32(4, totalPayloadSize, true); // Tamanho total - 8
    outBytes.set([0x57, 0x45, 0x42, 0x50], 8); // 'WEBP'

    let writeOffset = 12;
    for (const chunk of chunks) {
      for (let i = 0; i < 4; i++) {
        outBytes[writeOffset + i] = chunk.fourcc.charCodeAt(i);
      }
      outView.setUint32(writeOffset + 4, chunk.data.length, true);
      outBytes.set(chunk.data, writeOffset + 8);

      const pLen = chunk.data.length;
      if (pLen % 2 !== 0) {
        outBytes[writeOffset + 8 + pLen] = 0x00; // Byte de padding se ímpar
      }
      writeOffset += 8 + pLen + (pLen % 2);
    }

    return outBuffer;
  }

  /**
   * Converte um DataURL gerado pelo Canvas em um Blob final pronto com EXIF oficial do WhatsApp.
   */
  public static async processCanvasDataUrl(dataUrl: string, metadata?: StickerMetadata): Promise<Blob> {
    const res = await fetch(dataUrl);
    const rawBuffer = await res.arrayBuffer();
    const finalBuffer = this.injectWhatsAppExif(rawBuffer, metadata);
    return new Blob([finalBuffer], { type: 'image/webp' });
  }
}

