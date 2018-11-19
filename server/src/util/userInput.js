const safeChars = 'abcdefghijklmnopqrstuvwxyz' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  '1234567890' +
  '_';

const MAX_LENGTH = 50;

export const isSafeFileName = name => {
  if (name.length > MAX_LENGTH) return false;
  for (const char of name) {
    if (!safeChars.includes(char)) return false;
  }
  return true;
};
