import { Request, Response } from 'express';
import MasterPool from '../ws/MasterPool';
import sendAllAudioFiles from '../util/sendAllAudioFiles';
import AudioDB from '../audio/AudioDB';

const deleteAudio = (
  masterPool: MasterPool,
  audioDB: AudioDB,
) => async (req: Request, res: Response) => {
  const { name }: { name: string } = req.query;

  try {
    if (!(await audioDB.exists(name))) {
      audioDB
        .delete(name)
        .then(() => {
          res.sendStatus(204);
          sendAllAudioFiles(masterPool, audioDB);
        })
        .catch(() =>
          res.status(500).json({
            error: 'Error deleting audio file',
          }),
        );
    } else {
      res.status(500).json({ error: 'Audio file does not exist' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error deleting audio file' });
  }
};

export default deleteAudio;
