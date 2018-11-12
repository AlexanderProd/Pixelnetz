import jwt from 'jsonwebtoken';

const authenticate = userDB => (req, res) => {
  const { username, password } = req.body;

  if (!userDB.userExists(username)) {
    res.status(401).json({
      error: 'Incorrect username or password',
    });
  } else {
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
            .cookie('token', token, { httpOnly: true })
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
  }
};

export default authenticate;
