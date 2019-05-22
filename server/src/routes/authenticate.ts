import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserDB from '../UserDB';

const authenticate = (userDB: UserDB) => (
  req: Request,
  res: Response,
) => {
  const { password } = req.body;
  const username = 'admin';

  userDB
    .userPasswordMatches({ username, password })
    .then(matches => {
      if (matches) {
        // Issue token
        const token = jwt.sign(
          { username },
          process.env.JWT_SECRET as string,
          {
            expiresIn: '1h',
          },
        );
        res
          .status(200)
          .json({ user: username, token, expiresIn: '1h' });
      } else {
        res.status(401).json({
          error: 'Incorrect username or password',
        });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'Internal error please try again',
      });
    });
};

export default authenticate;
