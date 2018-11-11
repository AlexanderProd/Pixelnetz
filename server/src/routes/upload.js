const upload = (app) => app.post('/upload', function(req, res) {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let sampleFile = req.files.sampleFile;
  let uploadPath = __dirname + '/uploads/' + sampleFile.name;

  sampleFile.mv(uploadPath, function(err) {
    if (err){
      return res.status(500).send(err);
    }
    res.send('File uploaded!');
  });
});

export default upload;
