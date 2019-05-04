export const toHex = (num: number): string =>
  num.toString(16).padStart(2, '0');

export const roundFloat = (num: number, precision: number): number =>
  Number(num.toFixed(precision));

const base92Alphabet =
  "!#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~";

const base64Alphabet =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function createBaseEncoding(
  alphabet: string,
): {
  encode: (input: number) => string;
  decode: (input: string) => number;
} {
  const invAlphabet: {
    [key: string]: number;
  } = {};
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < alphabet.length; i++) {
    invAlphabet[alphabet.charAt(i)] = i;
  }

  const base = alphabet.length;

  function encode(inputNum: number): string {
    let num = inputNum;
    const div = base;
    let s = '';
    do {
      const rest = num % div;
      s = alphabet.charAt(rest) + s;
      num = Math.floor(num / base);
    } while (num > 0);
    return s;
  }

  function decode(str: string): number {
    const mult = base;
    let num = 0;
    // eslint-disable-next-line no-plusplus
    for (let i = str.length - 1; i >= 0; i--) {
      const index = str.length - 1 - i;
      const char = str.charAt(i);
      num += mult ** index * invAlphabet[char];
    }
    return num;
  }

  return { encode, decode };
}

const base64 = createBaseEncoding(base64Alphabet);

export const toBase64 = base64.encode;

export const fromBase64 = base64.decode;

const base92 = createBaseEncoding(base92Alphabet);

export const toBase92 = base92.encode;

export const fromBase92 = base92.decode;
