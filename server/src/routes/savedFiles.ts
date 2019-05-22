import { Request, Response } from 'express';
import readSavedFiles from '../util/readSavedFiles';

const savedFiles = () => async (req: Request, res: Response) => {
  try {
    const fileList = await readSavedFiles();
    res.status(200).json(fileList);
  } catch (e) {
    res.status(500).json({ error: 'Error reading saved files' });
  }
};

export default savedFiles;
