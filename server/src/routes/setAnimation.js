import fs from 'fs';
import { promisify } from 'util';
import { SET_ANIMATION } from '../../../shared/util/socketActionTypes';
import { isSafeFileName } from '../util/userInput';

const readFile = promisify(fs.readFile);

const setAnimation = clients => async (req, res) => {
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
    const sequenceJSON = await readFile(`${__dirname}/../sequences/db/${name}.json`);
    sequence = JSON.parse(sequenceJSON);
  } catch (e) {
    res.status(500).json({ error: 'Error opening sequence file' });
    return;
  }

  const seqWidth = sequence[0].length;
  const seqHeight = sequence.length;

  const dimensions = {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity,
  };

  clients.forEachSync(({ properties: { x, y } }) => {
    if (x < dimensions.minX) dimensions.minX = x;
    if (y < dimensions.minY) dimensions.minY = y;
    if (x > dimensions.maxX) dimensions.maxX = x;
    if (y > dimensions.maxY) dimensions.maxY = y;
  });

  const offsetX = dimensions.minX;
  const offsetY = dimensions.minY;
  const gridWidth = dimensions.maxX - offsetX + 1;
  const gridHeight = dimensions.maxY - offsetY + 1;
  const scaleWidth = Math.ceil(seqWidth / gridWidth);
  const scaleHeight = Math.ceil(seqHeight / gridHeight);

  const scaledSequence = sequence
    .filter((elem, i) => i % scaleHeight === 0)
    .map(row => row.filter((elem, i) => i % scaleWidth === 0));

  clients.forEach((socket) => {
    console.log('set: ', socket.id());
    const { x, y } = socket.properties;
    socket.send({
      actionType: SET_ANIMATION,
      animation: {
        sequence: scaledSequence[y - offsetY][x - offsetX],
        stepLength: 1000,
        repeat: false,
      },
    });
  });

  res.sendStatus(200);
};

export default setAnimation;
