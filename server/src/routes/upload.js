const upload = (app) => app.post('/upload', (req, res) => {
  const { file } = req.files;
  res.sendStatus(200);
});

export default upload;
