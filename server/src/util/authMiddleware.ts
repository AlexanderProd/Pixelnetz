import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';

export interface JWTResponse extends Response {
  username?: string;
}

const withAuth = (
  req: Request,
  res: JWTResponse,
  next: NextFunction,
) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    req.cookies.token;

  if (!token) {
    res
      .status(401)
      .json({ error: 'Unauthorized: No token provided' });
  } else {
    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err: VerifyErrors, decoded: any) => {
        if (err) {
          res
            .status(401)
            .json({ error: 'Unauthorized: Invalid token' });
        } else {
          res.username = decoded.username;
          next();
        }
      },
    );
  }
};

export default withAuth;
