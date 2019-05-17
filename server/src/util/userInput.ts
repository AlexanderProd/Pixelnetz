const safeChars =
  'abcdefghijklmnopqrstuvwxyz' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  '1234567890' +
  '_';

const MAX_LENGTH = 50;

// eslint-disable-next-line import/prefer-default-export
export function isSafeFileName(name: string): boolean {
  if (name.length > MAX_LENGTH) return false;
  for (const char of name) {
    if (!safeChars.includes(char)) return false;
  }
  return true;
}
