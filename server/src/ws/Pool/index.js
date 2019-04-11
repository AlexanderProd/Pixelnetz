import url from 'url';
import WebSocket from 'ws';
import Emitter from '../Emitter';
import Socket from '../Socket';
import syncTime from '../syncTime';

const generateKey = () =>
  `${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`.padStart(
    16,
    '0',
  );

class Pool extends Emitter {
  constructor({ port, server, path }) {
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

    this._pool = new Map();

    this._wsServer.on('connection', (socket, req) => {
      const id = generateKey();
      const ip = req.connection.remoteAddress;
      socket.isOpen = true;

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
        this.emit('message', JSON.parse(message), this._pool.get(id));
      });

      socket.on('close', () => {
        socket.isOpen = false;
        this._pool.delete(id);
        this.emit('close', id);
      });
    });
  }

  size() {
    return this._pool.size;
  }

  forEachSync(callback) {
    for (const socket of this._pool.values()) {
      callback(socket);
    }
  }

  forEach(callback) {
    for (const socket of this._pool.values()) {
      setTimeout(() => {
        callback(socket);
      }, 0);
    }
  }

  sendAll(message) {
    this.forEach(socket => socket.send(message));
  }
}

export default Pool;
