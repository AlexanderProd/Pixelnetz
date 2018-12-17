import { SET_ANIMATION } from '../../../shared/util/socketActionTypes';
import { isSafeFileName } from '../util/userInput';
import Sequence from '../sequences/Sequence';

const setSequence = clients => async (req, res) => {
  const { name } = req.query;

  if (clients.size < 1) {
    res.status(503).json({ error: 'No pixel clients connected' });
    return;
  }

  if (!isSafeFileName(name)) {
    res.status(400).json({ error: 'Invalid sequence name' });
    return;
  }

  let sequence;
  try {
    sequence = await Sequence.load(name);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'Error opening sequence file' });
    return;
  }

  let dimensions;
  try {
    dimensions = clients.dimensions();
  } catch (e) {
    res.status(503).json({ error: 'No valid pixel coordinates' });
    return;
  }

  const offsetX = dimensions.minX;
  const offsetY = dimensions.minY;
  const gridWidth = dimensions.maxX - offsetX + 1;
  const gridHeight = dimensions.maxY - offsetY + 1;
  const scaleWidth = Math.ceil(sequence.width / gridWidth);
  const scaleHeight = Math.ceil(sequence.height / gridHeight);

  let matrix;
  try {
    matrix = await sequence.matrix;
  } catch (e) {
    res.status(500).json({ error: 'Error loading sequence matrix' });
    return;
  }

  const scaledSequence = matrix
    .filter((elem, i) => i % scaleHeight === 0)
    .map(row => row.filter((elem, i) => i % scaleWidth === 0));

  clients.forEach((socket) => {
    console.log('set: ', socket.id());
    const { x, y } = socket.properties;
    socket.send({
      actionType: SET_ANIMATION,
      animation: {
        sequence: scaledSequence[y - offsetY][x - offsetX],
        ...sequence.info,
      },
    });
  });

  res.sendStatus(200);
};

export default setSequence;
