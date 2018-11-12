const upload = (app) => app.post('/upload', function(req, res) {
  console.log(req);

  const sampleFile = req.files.sampleFile;
  const uploadPath = `${__dirname}/uploads/${sampleFile.name}`;

  sampleFile.mv(uploadPath, function(err) {
    if (err){
      return res.status(500).send(err);
    };
    res.send('File uploaded!');
  });
});

export default upload;
