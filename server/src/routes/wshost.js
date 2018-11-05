const wshost = (app, hostname) => app.get(
  '/wshost',
  (req, res) => res.json({ hostname }),
);

export default wshost;
