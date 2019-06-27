import { Request, Response } from 'express';
import MasterPool from '../ws/MasterPool';
import sendAllAudioFiles from '../util/sendAllAudioFiles';
import AudioDB from '../audio/AudioDB';

const toggleAudio = (
  masterPool: MasterPool,
  audioDB: AudioDB,
) => async (req: Request, res: Response) => {
  const { name, value }: { name: string; value: string } = req.query;
  const selected = value === 'true';
  try {
    if (await audioDB.exists(name)) {
      audioDB
        .setSelected(name, selected)
        .then(() => {
          res.sendStatus(204);
          sendAllAudioFiles(masterPool, audioDB);
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({
            error: 'Error toggling audio file selection state',
          });
        });
    } else {
      res.status(500).json({ error: 'Audio file does not exist' });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: 'Error toggling audio file selection state' });
  }
};

export default toggleAudio;
