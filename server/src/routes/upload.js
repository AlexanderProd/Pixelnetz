import fs from 'fs';
import { promisify } from 'util';
import rasterize from '../sequences/rasterize';
import { isSafeFileName } from '../util/userInput';

const allowedTypes = [
  'image/png',
  'image/jpeg',
];

const writeFile = promisify(fs.writeFile);

const upload = () => (req, res) => {
  const { file } = req.files;

  if (!isSafeFileName(file.name)) {
    res.status(400).json({ error: 'Invalid sequence name' });
    return;
  }

  if (!allowedTypes.includes(file.mimetype)) {
    res.status(400).json({ error: 'Invalid file format' });
    return;
  }

  rasterize(file.data, file.mimetype)
    .then(pixelMatrix => pixelMatrix.map(
      row => row.map(col => [[col, 1]]),
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
