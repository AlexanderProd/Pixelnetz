export const toHex = (num: number): string =>
  num.toString(16).padStart(2, '0');

export const roundFloat = (num: number, precision: number): number =>
  Number(num.toFixed(precision));
