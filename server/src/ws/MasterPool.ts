import { Server } from 'http';
import Pool from './Pool';
import Socket from './Socket';

class MasterPool extends Pool {
  constructor(server: Server) {
    super({ server, path: '/master' });

    this.on('connection', (socket: Socket) => {
      console.log(
        `MASTER: ${socket.id()} deltaTime=${socket.deltaTime()}`,
      );
    });
  }
}

export default MasterPool;
