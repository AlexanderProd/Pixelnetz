import { isSafeFileName } from '../util/userInput';
import sendAllSequences from '../util/sendAllSequences';
import Sequence from '../sequences/Sequence';
import mimetypes from '../sequences/mimetypes';

const allowedTypes = [
  mimetypes.PNG,
  mimetypes.JPEG,
  mimetypes.GIF,
];

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

  Sequence.fromFile({ file, repeat: false })
    .then(sequence => sequence.save())
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
