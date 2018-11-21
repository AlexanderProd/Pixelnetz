const CHARS = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';

const createKeyGenerator = (keyLength = 10) => {
  const keys = new Set();

  const generate = () => {
    let key = '';
    while (key.length === 0) {
      let tmp = '';
      for (let i = 0; i < keyLength; i++) {
        tmp += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
      }
      if (!keys.has(tmp)) {
        key = tmp;
      }
    }
    keys.add(key);
    return key;
  };

  return {
    generate,
  };
};

export default createKeyGenerator;
