import rasterize from '../sequences/rasterize';

const upload = (app) => app.post('/upload', (req, res) => {
  const { file } = req.files;
  res.sendStatus(200);
  rasterize(file.data)
    .then((pixelMatrix) => {
      pixelMatrix.forEach(row => console.log(row.join()));
    })
    .catch(err => console.log(err));
});

export default upload;
