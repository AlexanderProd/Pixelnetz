import { SET_SEQUENCE, DIMENSIONS } from '../../../shared/dist/util/socketActionTypes';
import { isSafeFileName } from '../util/userInput';
import Sequence from '../sequences/Sequence';

const setSequence = (clientPool, masterPool) => async (req, res) => {
  const { name } = req.query;
  const repeat = req.query.repeat === 'true';
  const stepLength = Number(req.query.stepLength);

  if (clientPool.size < 1) {
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
    console.error(e);
    res.status(500).json({ error: 'Error opening sequence file' });
    return;
  }

  let dimensions;
  try {
    dimensions = clientPool.dimensions();
  } catch (e) {
    console.error(e);
    res.status(503).json({ error: 'No valid pixel coordinates' });
    return;
  }

  sequence.scale(dimensions);

  try {
    await sequence.loadMatrix();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error loading sequence matrix' });
    return;
  }

  const masterMatrix = sequence.getMasterMatrix();
  const sequenceInfo = {
    ...sequence.info,
    repeat,
    stepLength,
  };

  masterPool.sendAll({
    actionType: DIMENSIONS,
    dimensions,
  });

  masterPool.sendAll({
    actionType: SET_SEQUENCE,
    sequence: {
      ...sequenceInfo,
      frames: masterMatrix,
      width: dimensions.width,
      height: dimensions.height,
    },
  });

  clientPool.forEach((socket) => {
    console.log('set: ', socket.id());
    const { x, y } = socket.properties;
    socket.send({
      actionType: SET_SEQUENCE,
      sequence: {
        frames: sequence.getFrames(x, y),
        ...sequenceInfo,
      },
    });
  });

  res.sendStatus(200);
};

export default setSequence;
