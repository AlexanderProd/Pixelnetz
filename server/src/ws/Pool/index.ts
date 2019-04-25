import url from 'url';
import WebSocket from 'ws';
import { Server } from 'http';
import Emitter from '../Emitter';
import Socket from '../Socket';
import syncTime from '../syncTime';

const generateKey = () =>
  `${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`.padStart(
    16,
    '0',
  );

class Pool extends Emitter {
  private _wsServer: WebSocket.Server;

  private _pool: Map<string, Socket>;

  constructor({
    port,
    server,
    path,
  }: {
    port: number;
    server: Server;
    path: string;
  }) {
    super(['connection', 'message', 'close']);
    if (port) {
      this._wsServer = new WebSocket.Server({ port });
    } else if (server && path) {
      this._wsServer = new WebSocket.Server({ noServer: true });
      server.on('upgrade', (req, socket, head) => {
        const { pathname } = url.parse(req.url);
        if (pathname === path) {
          this._wsServer.handleUpgrade(req, socket, head, ws =>
            this._wsServer.emit('connection', ws, req),
          );
        }
      });
    } else {
      throw new Error(
        'Either port or server and path have to be specified',
      );
    }

    this._pool = new Map<string, Socket>();

    this._wsServer.on('connection', (socket: WebSocket, req) => {
      const id = generateKey();
      const ip = req.connection.remoteAddress;
      // eslint-disable-next-line no-param-reassign
      (socket as any).isOpen = true;

      syncTime(socket).then(deltaTime => {
        const syncedSocket = new Socket({
          socket,
          id,
          ip,
          deltaTime,
        });
        this._pool.set(id, syncedSocket);
        this.emit('connection', syncedSocket);
      });

      socket.on('message', message => {
        this.emit(
          'message',
          JSON.parse(message as string),
          this._pool.get(id),
        );
      });

      socket.on('close', () => {
        // eslint-disable-next-line no-param-reassign
        (socket as any).isOpen = false;
        this._pool.delete(id);
        this.emit('close', id);
      });
    });
  }

  size() {
    return this._pool.size;
  }

  forEachSync(callback: (socket: Socket) => void) {
    for (const socket of this._pool.values()) {
      callback(socket);
    }
  }

  forEach(callback: (socket: Socket) => void) {
    for (const socket of this._pool.values()) {
      setTimeout(() => {
        callback(socket);
      }, 0);
    }
  }

  sendAll(message: any) {
    this.forEach(socket => socket.send(message));
  }
}

export default Pool;
