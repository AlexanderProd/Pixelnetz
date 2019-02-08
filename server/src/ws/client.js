import { POSITION } from '../../../shared/dist/util/socketActionTypes';
import Pool from './Pool';

const createClientPool = (server) => {
  const clientPool = new Pool({ server, path: '/' });
  clientPool.register('position');

  clientPool.on('connection', (socket) => {
    socket.send({ actionType: POSITION });
  });

  clientPool.on('message', (message, socket) => {
    if (message.actionType === POSITION) {
      const { x, y } = message;
      socket.properties.x = Number(x);
      socket.properties.y = Number(y);
      console.log(`PIXEL: ${socket.id()} x=${x}, y=${y}, deltaTime=${socket.deltaTime()}`);
      clientPool.emit('position', socket);
    }
  });

  clientPool.dimensions = () => {
    const dimensions = {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity,
    };

    clientPool.forEachSync(({ properties: { x, y } }) => {
      if (x < dimensions.minX) dimensions.minX = x;
      if (y < dimensions.minY) dimensions.minY = y;
      if (x > dimensions.maxX) dimensions.maxX = x;
      if (y > dimensions.maxY) dimensions.maxY = y;
    });

    if (
      dimensions.minX === Infinity ||
      dimensions.minY === Infinity ||
      dimensions.maxX === -Infinity ||
      dimensions.maxY === -Infinity
    ) {
      throw new Error('Invalid pixel coordinates');
    }

    const xOffset = dimensions.minX;
    const yOffset = dimensions.minY;
    const width = dimensions.maxX - xOffset + 1;
    const height = dimensions.maxY - yOffset + 1;

    return {
      xOffset,
      yOffset,
      width,
      height,
    };
  };

  return clientPool;
};

export default createClientPool;
