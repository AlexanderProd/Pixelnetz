class UniqueKeyGenerator {
  constructor() {
    this.chars = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';
    this.keys = new Set();
    this.keyLength = 10;
  }

  generate() {
    let key = '';
    while (key.length === 0) {
      let tmp = '';
      for (let i = 0; i < this.keyLength; i++) {
        tmp += this.chars.charAt(Math.floor(Math.random() * this.chars.length));
      }
      if (!this.keys.has(tmp)) {
        key = tmp;
      }
    }
    this.keys.add(key);
    return key;
  }
}

const keyGen = new UniqueKeyGenerator();

export default keyGen;
