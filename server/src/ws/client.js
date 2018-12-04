import { POSITION } from '../../../shared/util/socketActionTypes';
import createPool from './pool';

const createClientPool = (server) => {
  const clientPool = createPool({ server, path: '/' });

  clientPool.onConnection((socket) => {
    socket.send({ actionType: POSITION });
  });

  clientPool.onMessage((message, socket) => {
    if (message.actionType === POSITION) {
      const { x, y } = message;
      socket.properties.x = Number(x);
      socket.properties.y = Number(y);
      console.log(`PIXEL: ${socket.id()} x=${x}, y=${y}, deltaTime=${socket.deltaTime()}`);
    }
  });

  return clientPool;
};

export default createClientPool;
