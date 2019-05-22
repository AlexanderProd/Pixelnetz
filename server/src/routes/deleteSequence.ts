import { Request, Response } from 'express';
import sendAllSequences from '../util/sendAllSequences';
import Sequence from '../sequences/Sequence';
import MasterPool from '../ws/MasterPool';

const savedFiles = (masterPool: MasterPool) => async (
  req: Request,
  res: Response,
) => {
  const { name }: { name: string } = req.query;

  try {
    if (!(await Sequence.exists(name))) {
      Sequence.delete(name)
        .then(() => {
          res.sendStatus(204);
          sendAllSequences(masterPool);
        })
        .catch(() =>
          res.status(500).json({
            error: 'Error deleting sequence',
          }),
        );
    } else {
      res.status(500).json({ error: 'Sequence does not exist' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error deleting sequence' });
  }
};

export default savedFiles;
