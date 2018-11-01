const bcrypt = require('bcrypt');

class UserDB {
  constructor() {
    this.db = new Map();
    this.SALT_ROUNDS = 10;
  }

  hash(data, saltRounds) {
    return new Promise((res, rej) => bcrypt.hash(
      data,
      saltRounds,
      (err, hashedData) => (err ? rej(err) : res(hashedData)),
    ));
  }

  compare(data, storedData) {
    return new Promise((res, rej) => bcrypt.compare(
      data,
      storedData,
      (err, isMatch) => (err ? rej(err) : res(isMatch)),
    ));
  }

  userPasswordMatches({ username, password }) {
    return this.compare(
      password,
      this.db.get(username).password,
    );
  }

  userExists(username) {
    return this.db.has(username);
  }

  saveUser({ username, password }) {
    return new Promise((res, rej) => {
      if (this.db.has(username)) {
        rej('Username already exists.');
      } else {
        this.hash(password, this.SALT_ROUNDS)
          .then(hashedPassword => {
            this.db.set(username, {
              username,
              password: hashedPassword,
              registered: Date.now(),
            });
            res(username);
          })
          .catch((err) => rej('Error saving user.', err));
      }
    });
  }
}

module.exports = UserDB;
