import fs from 'fs';
import { promisify } from 'util';
import rasterize from '../sequences/rasterize';
import toMatrix from '../sequences/toMatrix';

const writeFile = promisify(fs.writeFile);

const upload = () => (req, res) => {
  const { file } = req.files;

  rasterize(file.data)
    .then(pixelMatrix => pixelMatrix.map(
      row => toMatrix(row, 1),
    ))
    .then((sequenceMatrix) => writeFile(
      `${__dirname}/../sequences/db/${file.name}.json`,
      JSON.stringify(sequenceMatrix),
    ))
    .then(() => {
      console.log('file written successfully');
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

export default upload;
