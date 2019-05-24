import { Request, Response } from 'express';
import { isSafeFileName } from '../util/userInput';
import sendAllSequences from '../util/sendAllSequences';
import Sequence from '../sequences/Sequence';
import Mimetypes from '../sequences/mimetypes';
import MasterPool from '../ws/MasterPool';
import { DEFAULT_BIT_DEPTH } from '../../../shared/src/util/colors';

const allowedTypes = [Mimetypes.PNG, Mimetypes.JPEG, Mimetypes.GIF];

const upload = (masterPool: MasterPool) => (
  req: Request,
  res: Response,
) => {
  const bitDepth = Number(req.query.bit_depth) || DEFAULT_BIT_DEPTH;

  if (!(req.files && req.files.file)) {
    res.status(400).json({ error: 'No file found' });
    return;
  }

  const { file } = req.files;

  if (Array.isArray(file)) {
    res
      .status(400)
      .json({ error: `Expected one file, found ${file.length}` });
    return;
  }

  if (!isSafeFileName(file.name)) {
    res.status(400).json({ error: 'Invalid sequence name' });
    return;
  }

  if (!allowedTypes.includes(file.mimetype as Mimetypes)) {
    res.status(400).json({ error: 'Invalid file format' });
    return;
  }

  const start = Date.now();
  Sequence.fromFile({ file, repeat: false, bitDepth })
    .then(() => {
      const seconds = (Date.now() - start) / 1000;
      console.log(`file written successfully in ${seconds} sec`);
      res.sendStatus(200);
      sendAllSequences(masterPool);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

export default upload;
