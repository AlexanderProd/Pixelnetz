import jwt from 'jsonwebtoken';

const withAuth = (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    req.cookies.token;

  if (!token) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
      } else {
        res.username = decoded.username;
        next();
      }
    });
  }
};

export default withAuth;
