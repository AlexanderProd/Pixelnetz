import { Response, Request } from 'express';
import {
  SET_SEQUENCE,
  APPEND_SEQUENCE,
  DIMENSIONS,
} from '../../../shared/dist/util/socketActionTypes';
import { isSafeFileName } from '../util/userInput';
import Sequence from '../sequences/Sequence';
import Socket from '../ws/Socket';
import Pool from '../ws/Pool';
import ClientPool, { GridDimensions } from '../ws/ClientPool';

const setSequence = (
  clientPool: ClientPool,
  masterPool: Pool,
) => async (req: Request, res: Response) => {
  const { name, test, w, h } = req.query;
  const isTest = test === 'true';
  const testWidth = Number(w);
  const testHeight = Number(h);
  const repeat = req.query.repeat === 'true';
  const stepLength = Number(req.query.stepLength);

  if (clientPool.size() < 1 && !isTest) {
    res.status(503).json({ error: 'No pixel clients connected' });
    return;
  }

  if (!isSafeFileName(name)) {
    res.status(400).json({ error: 'Invalid sequence name' });
    return;
  }

  let sequence: Sequence;
  try {
    sequence = await Sequence.load(name);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error opening sequence file' });
    return;
  }

  let dimensions: GridDimensions;
  try {
    if (isTest) {
      dimensions = {
        width: testWidth,
        height: testHeight,
        xOffset: 0,
        yOffset: 0,
      };
    } else {
      dimensions = clientPool.dimensions();
    }
  } catch (e) {
    console.error(e);
    res.status(503).json({ error: 'No valid pixel coordinates' });
    return;
  }

  sequence.scale(dimensions);

  masterPool.sendAll({
    actionType: DIMENSIONS,
    dimensions,
  });

  for await (const { index } of sequence.loadMatrices()) {
    const masterMatrix = sequence.getMasterMatrix(index);
    const sequenceInfo = {
      ...sequence.info,
      repeat,
      stepLength,
    };

    masterPool.sendAll({
      actionType: index === 0 ? SET_SEQUENCE : APPEND_SEQUENCE,
      sequence: {
        ...sequenceInfo,
        frames: masterMatrix,
        width: dimensions.width,
        height: dimensions.height,
      },
    });

    const poolSize = clientPool.size();
    console.log(
      `setting part ${index} of sequence for ${poolSize} clients`,
    );

    clientPool.forEachSync((socket: Socket) => {
      const { x, y } = socket.properties;
      socket.send({
        actionType: index === 0 ? SET_SEQUENCE : APPEND_SEQUENCE,
        sequence: {
          frames: sequence.getFrames(x, y),
          ...sequenceInfo,
        },
      });
    });
  }

  res.sendStatus(200);
};

export default setSequence;
