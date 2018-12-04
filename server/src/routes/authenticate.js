import jwt from 'jsonwebtoken';

const authenticate = userDB => (req, res) => {
  const { password } = req.body;
  const username = 'admin';

  userDB.userPasswordMatches({ username, password })
    .then(matches => {
      if (matches) {
        // Issue token
        const token = jwt.sign(
          { username },
          process.env.JWT_SECRET,
          { expiresIn: '1h' },
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
