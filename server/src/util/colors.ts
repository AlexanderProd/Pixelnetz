/* eslint-disable no-bitwise, no-plusplus */
import { toBase92, fromBase92 } from './numbers';

/**
 * Uint8Array of length 3 representing a RGB color: [R, G, B]
 */
export type RGBColor = Uint8Array;

export enum RGBColorIndecies {
  R = 0,
  G = 1,
  B = 2,
}

export function createBitFieldEncoder(
  shape: ReadonlyArray<number>,
): {
  encode: (data: Uint8Array) => number;
  decode: (bitField: number) => Uint8Array;
} {
  const numChannels = shape.length;

  function encode(data: Uint8Array): number {
    if (data.length !== numChannels)
      throw new Error('Invalid input length');
    let result = 0;
    for (let i = numChannels - 1; i >= 0; i--) {
      const current = data[i];
      const bitDepth = shape[i];
      result <<= bitDepth;
      result |= current;
    }
    return result;
  }

  function decode(bitField: number): Uint8Array {
    const result: Uint8Array = new Uint8Array(numChannels);
    let value = bitField;
    for (let i = 0; i < numChannels; i++) {
      const bitDepth = shape[i];
      const maxValue = 2 ** bitDepth - 1;
      result[i] = Number(value & maxValue);
      value >>= bitDepth;
    }
    return result;
  }

  return { encode, decode };
}

export const COLOR_BIT_DEPTH = 8;
export const BIT_DEPTH = 7;
export const LOSS = 2 ** (COLOR_BIT_DEPTH - BIT_DEPTH);
export const COLOR_CHANNELS = 3;
export const COLOR_SHAPE: ReadonlyArray<number> = [
  BIT_DEPTH,
  BIT_DEPTH,
  BIT_DEPTH,
];

export function toRGBColor(
  r: number,
  g: number,
  b: number,
): RGBColor {
  const rgbColor: RGBColor = new Uint8Array(COLOR_CHANNELS);
  rgbColor[RGBColorIndecies.R] = r;
  rgbColor[RGBColorIndecies.G] = g;
  rgbColor[RGBColorIndecies.B] = b;
  return rgbColor;
}

const colorBitFieldEncoder = createBitFieldEncoder(COLOR_SHAPE);

export const encodeBitField = colorBitFieldEncoder.encode;

export const decodeBitField = colorBitFieldEncoder.decode;

// eslint-disable-next-line import/export
export function encodeColor(color: RGBColor): string;
// eslint-disable-next-line import/export
export function encodeColor(r: number, g: number, b: number): string;

// eslint-disable-next-line import/export
export function encodeColor(
  r: RGBColor | number,
  g?: number,
  b?: number,
): string {
  let color: RGBColor;
  if (typeof r === 'number' && g && b) {
    color = toRGBColor(r, g, b);
  } else {
    color = r as RGBColor;
  }
  const downSampledColor = color.map(c => Math.floor(c / LOSS));
  const bitField = encodeBitField(downSampledColor);
  return toBase92(bitField);
}

export function decodeColor(base92BitField: string): RGBColor {
  const bitField = fromBase92(base92BitField);
  const downSampledColor = decodeBitField(bitField);
  return downSampledColor.map(c => c * LOSS);
}

export function toUint8Array(arr: number[]): Uint8Array {
  const c = new Uint8Array(arr.length);
  arr.forEach((n, i) => {
    c[i] = n;
  });
  return c;
}
