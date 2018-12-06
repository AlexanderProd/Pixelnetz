import bcrypt from 'bcrypt';

class UserDB {
  db = new Map();
  saltRounds = Number(process.env.SALT_ROUNDS);

  userPasswordMatches({ username, password }) {
    return bcrypt.compare(
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
        bcrypt.hash(password, this.saltRounds)
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

export default UserDB;
