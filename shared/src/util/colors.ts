/* eslint-disable no-bitwise, no-plusplus */
import { toBase92, fromBase92 } from './numbers';

/**
 * Uint8Array of length 3 representing an RGB color: [R, G, B]
 */
export type RGBColor = Uint8Array;

export enum RGBColorIndecies {
  R = 0,
  G = 1,
  B = 2,
}

export function createBitFieldEncoding(
  shape: ReadonlyArray<number>,
): {
  encode: (data: Uint8Array) => number;
  decode: (bitField: number) => Uint8Array;
} {
  const masks = shape
    .map((bitDepth, i, arr) => ({
      max: 2 ** bitDepth - 1,
      shift: arr
        .filter((x, j) => j < i)
        .reduce((acc, x) => acc + x, 0),
    }))
    .map(x => ({ ...x, mask: x.max << x.shift }));

  function encode(data: Uint8Array): number {
    let bitField = 0;
    for (let i = 0; i < masks.length; i++) {
      bitField |= masks[i].mask & (data[i] << masks[i].shift);
    }
    return bitField;
  }

  function decode(bitField: number): Uint8Array {
    const res = new Uint8Array(masks.length);
    for (let i = 0; i < masks.length; i++) {
      res[i] = (bitField & masks[i].mask) >> masks[i].shift;
    }
    return res;
  }

  return { encode, decode };
}

export const COLOR_BIT_DEPTH = 8;
export const DEFAULT_BIT_DEPTH = 7;
export const COLOR_CHANNELS = 3;

export function createColorEncoder(
  bitDepth: number,
): {
  encode: (data: RGBColor) => string;
  decode: (bitField: string) => RGBColor;
} {
  const loss = 2 ** (COLOR_BIT_DEPTH - bitDepth);
  const colorShape: ReadonlyArray<number> = [
    bitDepth,
    bitDepth,
    bitDepth,
  ];

  const colorBitFieldEncoder = createBitFieldEncoding(colorShape);

  const encodeBitField = colorBitFieldEncoder.encode;

  const decodeBitField = colorBitFieldEncoder.decode;

  function encode(color: RGBColor): string {
    const downSampledColor = color.map(c => Math.floor(c / loss));
    const bitField = encodeBitField(downSampledColor);
    return toBase92(bitField);
  }

  function decode(base92BitField: string): RGBColor {
    const bitField = fromBase92(base92BitField);
    const downSampledColor = decodeBitField(bitField);
    return downSampledColor.map(c => c * loss);
  }

  return {
    encode,
    decode,
  };
}

export function toUint8Array(arr: number[]): Uint8Array {
  const c = new Uint8Array(arr.length);
  arr.forEach((n, i) => {
    c[i] = n;
  });
  return c;
}

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
