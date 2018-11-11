const upload = (app) => app.post('/upload', (req, res, next) => {
  let uploadFile = req.files.file;
  const fileName = req.files.file.name;
  uploadFile.mv(
    `${__dirname}/files/${fileName}`,
    function (err) {
      if (err) {
        return res.status(500).send(err)
      }

      res.json({
        file: `public/${req.files.file.name}`,
      })
    },
  );
});

export default upload;
