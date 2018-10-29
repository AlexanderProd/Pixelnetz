module.exports = (app, hostname) => app.get(
  '/wshost',
  (req, res) => res.json({ hostname }),
);
