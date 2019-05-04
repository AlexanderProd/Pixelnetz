import { Server } from 'http';
import { POSITION } from '../../../shared/dist/util/socketActionTypes';
import Pool from './Pool';

export interface GridDimensions {
  xOffset: number;
  yOffset: number;
  width: number;
  height: number;
}

class ClientPool extends Pool {
  constructor(server: Server) {
    super({ server, path: '/' });

    this.register('position');

    this.on('connection', socket => {
      socket.send({ actionType: POSITION });
    });

    this.on('message', (message, socket) => {
      if (message.actionType === POSITION) {
        const { x, y } = message;
        // eslint-disable-next-line no-param-reassign
        socket.properties.x = Number(x);
        // eslint-disable-next-line no-param-reassign
        socket.properties.y = Number(y);
        console.log(
          `PIXEL: ${socket.id()} x=${x}, y=${y}, deltaTime=${socket.deltaTime()}`,
        );
        this.emit('position', socket);
      }
    });
  }

  dimensions(): GridDimensions {
    const dimensions = {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity,
    };

    this.forEachSync(({ properties: { x, y } }) => {
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
  }
}

export default ClientPool;
