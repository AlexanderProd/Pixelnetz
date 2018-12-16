import fs from 'fs';
import { promisify } from 'util';
import rasterize from '../sequences/rasterize';
import { isSafeFileName } from '../util/userInput';
import sendAllSequences from '../util/sendAllSequences';

const allowedTypes = [
  'image/png',
  'image/jpeg',
  'image/gif',
];

const writeFile = promisify(fs.writeFile);

const upload = (masterPool) => (req, res) => {
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
    .then(({ matrix, stepLength }) => writeFile(
      `${__dirname}/../../db/${file.name}.json`,
      JSON.stringify(matrix),
    ))
    .then(() => {
      console.log('file written successfully');
      res.sendStatus(200);
      sendAllSequences(masterPool);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

export default upload;
