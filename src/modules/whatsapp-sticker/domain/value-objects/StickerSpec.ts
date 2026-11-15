import { DurationExceededError, StickerDomainError } from '../exceptions/StickerErrors.ts';

export type CropMode = 'fit_pad' | 'top_crop' | 'center_crop' | 'bottom_crop' | 'custom_crop';

export interface CropRect {
  sx: number;
  sy: number;
  sWidth: number;
  sHeight: number;
  dx: number;
  dy: number;
  dWidth: number;
  dHeight: number;
}

export interface StickerSpecParams {
  startTime?: number;
  endTime?: number;
  cropMode?: CropMode;
  zoom?: number;
  positionX?: number;
  positionY?: number;
  cropSize?: number;
}

export class StickerSpec {
  public static readonly TARGET_DIMENSION = 512;
  public static readonly MAX_DURATION_SECONDS = 6.0;
  public static readonly MAX_SIZE_BYTES = 500 * 1024;

  private readonly _startTime: number;
  private readonly _endTime: number;
  private readonly _cropMode: CropMode;
  private readonly _zoom: number;
  private readonly _positionX: number;
  private readonly _positionY: number;
  private readonly _cropSize: number;

  private constructor(
    startTime: number,
    endTime: number,
    cropMode: CropMode,
    zoom = 1.0,
    positionX = 50,
    positionY = 50,
    cropSize = 100
  ) {
    this._startTime = startTime;
    this._endTime = endTime;
    this._cropMode = cropMode;
    this._zoom = Math.max(1.0, Math.min(3.0, zoom));
    this._positionX = Math.max(0, Math.min(100, positionX));
    this._positionY = Math.max(0, Math.min(100, positionY));
    this._cropSize = Math.max(30, Math.min(100, cropSize));
  }

  public static create(params?: StickerSpecParams): StickerSpec {
    const startTime = params?.startTime ?? 0;
    const endTime = params?.endTime ?? 3;
    const cropMode = params?.cropMode ?? 'center_crop';
    const zoom = params?.zoom ?? 1.0;
    const positionX = params?.positionX ?? 50;
    const positionY = params?.positionY ?? 50;
    const cropSize = params?.cropSize ?? 100;

    if (startTime < 0 || endTime <= startTime) {
      throw new StickerDomainError('Invalid trim time interval.', 'invalid_trim_interval');
    }
    const duration = endTime - startTime;
    if (duration > this.MAX_DURATION_SECONDS) {
      throw new DurationExceededError();
    }

    return new StickerSpec(startTime, endTime, cropMode, zoom, positionX, positionY, cropSize);
  }

  public get startTime(): number {
    return this._startTime;
  }

  public get endTime(): number {
    return this._endTime;
  }

  public get duration(): number {
    return this._endTime - this._startTime;
  }

  public get cropMode(): CropMode {
    return this._cropMode;
  }

  public get zoom(): number {
    return this._zoom;
  }

  public get positionX(): number {
    return this._positionX;
  }

  public get positionY(): number {
    return this._positionY;
  }

  public get cropSize(): number {
    return this._cropSize;
  }

  /**
   * Computes source crop and destination coordinates for the 512x512 WebP canvas.
   */
  public calculateCropRect(videoWidth: number, videoHeight: number): CropRect {
    const vw = Math.max(1, videoWidth);
    const vh = Math.max(1, videoHeight);

    if (this._cropMode === 'fit_pad') {
      const scale = Math.min(512 / vw, 512 / vh);
      const dWidth = vw * scale;
      const dHeight = vh * scale;
      return {
        sx: 0,
        sy: 0,
        sWidth: vw,
        sHeight: vh,
        dx: (512 - dWidth) / 2,
        dy: (512 - dHeight) / 2,
        dWidth,
        dHeight,
      };
    }

    if (this._cropMode === 'top_crop') {
      const minDim = Math.min(vw, vh);
      return {
        sx: (vw - minDim) / 2,
        sy: 0,
        sWidth: minDim,
        sHeight: minDim,
        dx: 0,
        dy: 0,
        dWidth: 512,
        dHeight: 512,
      };
    }

    if (this._cropMode === 'bottom_crop') {
      const minDim = Math.min(vw, vh);
      return {
        sx: (vw - minDim) / 2,
        sy: Math.max(0, vh - minDim),
        sWidth: minDim,
        sHeight: minDim,
        dx: 0,
        dy: 0,
        dWidth: 512,
        dHeight: 512,
      };
    }

    if (this._cropMode === 'center_crop') {
      const minDim = Math.min(vw, vh);
      return {
        sx: (vw - minDim) / 2,
        sy: (vh - minDim) / 2,
        sWidth: minDim,
        sHeight: minDim,
        dx: 0,
        dy: 0,
        dWidth: 512,
        dHeight: 512,
      };
    }

    const minDim = Math.min(vw, vh);
    const windowDim = (minDim * (this._cropSize / 100)) / this._zoom;

    const maxSx = Math.max(0, vw - windowDim);
    const maxSy = Math.max(0, vh - windowDim);

    const sx = maxSx * (this._positionX / 100);
    const sy = maxSy * (this._positionY / 100);

    return {
      sx,
      sy,
      sWidth: windowDim,
      sHeight: windowDim,
      dx: 0,
      dy: 0,
      dWidth: 512,
      dHeight: 512,
    };
  }
}

