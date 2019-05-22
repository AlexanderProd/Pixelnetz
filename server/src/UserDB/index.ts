import bcrypt from 'bcryptjs';

interface PublicUser {
  username: string;
  password: string;
}

interface UserShape extends PublicUser {
  registered: number;
}

class UserDB {
  db: Map<string, UserShape> = new Map();

  saltRounds: number = Number(process.env.SALT_ROUNDS);

  userPasswordMatches({
    username,
    password,
  }: PublicUser): Promise<boolean> {
    if (!this.db.has(username)) return Promise.resolve(false);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return bcrypt.compare(password, this.db.get(username)!.password);
  }

  userExists(username: string): boolean {
    return this.db.has(username);
  }

  saveUser({ username, password }: PublicUser): Promise<string> {
    return new Promise((res, rej) => {
      if (this.db.has(username)) {
        rej(new Error('Username already exists.'));
      } else {
        bcrypt
          .hash(password, this.saltRounds)
          .then(hashedPassword => {
            this.db.set(username, {
              username,
              password: hashedPassword,
              registered: Date.now(),
            });
            res(username);
          })
          .catch(err => {
            console.error(err);
            rej(new Error('Error saving user.'));
          });
      }
    });
  }
}

export default UserDB;
