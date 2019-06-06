import fs from 'fs';
import { promisify } from 'util';
import { Request, Response } from 'express';
import { isSafeFileName } from '../util/userInput';
import MasterPool from '../ws/MasterPool';
import AudioMimetypes, { getFileExtension } from '../audio/Mimetypes';
import sendAllAudioFiles from '../util/sendAllAudioFiles';

const writeFile = promisify(fs.writeFile);

const allowedTypes = [
  AudioMimetypes.MP3,
  AudioMimetypes.WAV,
  AudioMimetypes.OGG,
];

const DB_PATH = `${__dirname}/../../../../audiodb`;

const uploadAudio = (masterPool: MasterPool) => (
  req: Request,
  res: Response,
) => {
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
    res.status(400).json({ error: 'Invalid file name' });
    return;
  }

  if (!allowedTypes.includes(file.mimetype as AudioMimetypes)) {
    res.status(400).json({ error: 'Invalid file format' });
    return;
  }

  writeFile(
    `${DB_PATH}/${file.name}.${getFileExtension(
      file.mimetype as AudioMimetypes,
    )}`,
    file.data,
  )
    .then(() => {
      console.log(`audio file written successfully`);
      res.sendStatus(200);
      sendAllAudioFiles(masterPool);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

export default uploadAudio;
