import sendAllSequences from '../util/sendAllSequences';
import Sequence from '../sequences/Sequence';

const savedFiles = (masterPool) => async (req, res) => {
  const { name } = req.query;

  try {
    const sequences = await Sequence.listAvailable();
    if (sequences.indexOf(name) !== -1) {
      Sequence.delete(name)
        .then(() => {
          res.sendStatus(204);
          sendAllSequences(masterPool);
        })
        .catch(() => res.status(500).json({
          error: 'Error deleting sequence',
        }));
    } else {
      res.status(500).json({ error: 'Sequence does not exist' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error deleting sequence' });
  }
};

export default savedFiles;
