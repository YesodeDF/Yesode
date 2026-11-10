import QRCode from 'qrcode';

export interface QrRenderOptions {
  width?: number;
  margin?: number;
  color?: {
    dark: string;
    light: string;
  };
}

export class QrCanvasService {
  public static async toDataUrl(content: string, options: QrRenderOptions = {}): Promise<string> {
    const opts: QRCode.QRCodeToDataURLOptions = {
      errorCorrectionLevel: 'M',
      width: options.width || 320,
      margin: options.margin !== undefined ? options.margin : 2,
      color: {
        dark: options.color?.dark || '#000000',
        light: options.color?.light || '#FFFFFF',
      },
    };
    return QRCode.toDataURL(content, opts);
  }

  public static async renderToCanvas(
    canvas: HTMLCanvasElement,
    content: string,
    options: QrRenderOptions = {}
  ): Promise<void> {
    const opts: QRCode.QRCodeRenderersOptions = {
      errorCorrectionLevel: 'M',
      width: options.width || 320,
      margin: options.margin !== undefined ? options.margin : 2,
      color: {
        dark: options.color?.dark || '#000000',
        light: options.color?.light || '#FFFFFF',
      },
    };
    return QRCode.toCanvas(canvas, content, opts);
  }
}

