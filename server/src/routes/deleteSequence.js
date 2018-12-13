import { unlink, existsSync } from 'fs';
import { promisify } from 'util';
import sendAllSequences from '../util/sendAllSequences';

const deleteFile = promisify(unlink);

const savedFiles = (masterPool) => (req, res) => {
  const path = `${__dirname}/../../db/${req.query.name}.json`;

  try {
    if (existsSync(path)) {
      deleteFile(path)
        .then(() => {
          res.sendStatus(204);
          sendAllSequences(masterPool);
        })
        .catch(() => res.status(500).json({ error: 'Error deleting sequence' }));
    } else {
      res.status(500).json({ error: 'Error deleting sequence' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error deleting sequence' });
  }
};

export default savedFiles;
