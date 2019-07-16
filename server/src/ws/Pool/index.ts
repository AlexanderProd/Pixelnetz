import url from 'url';
import WebSocket from 'ws';
import { Server } from 'http';
import Emitter from '../Emitter';
import Socket from '../Socket';
import syncTime from '../syncTime';
import createSender from '../../util/createSender';
import {
  PING,
  PONG,
} from '../../../../shared/src/util/socketActionTypes';

const generateKey = () =>
  `${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`.padStart(
    16,
    '0',
  );

const CHECK_FOR_DEAD_INTERVAL = 30000;
const REMOVE_DEAD_TIMEOUT = 10000;

interface PoolOptions {
  port?: number;
  server?: Server;
  path?: string;
}

class Pool extends Emitter {
  private _wsServer: WebSocket.Server;

  private _pool: Map<string, Socket>;

  constructor(options: PoolOptions) {
    super(['connection', 'message', 'close']);
    this._wsServer = this.createServer(options);
    this._pool = new Map<string, Socket>();
    this._wsServer.on('connection', (socket: WebSocket, req) => {
      const id = generateKey();
      const ip = req.connection.remoteAddress;
      // eslint-disable-next-line no-param-reassign
      (socket as any).isOpen = true;
      this.syncSocket(socket, id, ip);
      this.handleQuietDeath(socket);
      socket.on('message', this.handleMessage(id));
      socket.on('close', this.handleClose(socket, id));
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private createServer({
    port,
    server,
    path,
  }: PoolOptions): WebSocket.Server {
    if (port) {
      return new WebSocket.Server({ port });
    }
    if (server && path) {
      const wsServer = new WebSocket.Server({ noServer: true });
      server.on('upgrade', (req, socket, head) => {
        const { pathname } = url.parse(req.url);
        if (pathname === path) {
          wsServer.handleUpgrade(req, socket, head, ws =>
            wsServer.emit('connection', ws, req),
          );
        }
      });
      return wsServer;
    }
    throw new Error(
      'Either port or server and path have to be specified',
    );
  }

  private syncSocket(
    socket: WebSocket,
    id: string,
    ip?: string,
  ): Promise<void> {
    return syncTime(socket).then(deltaTime => {
      const syncedSocket = new Socket({
        socket,
        id,
        ip,
        deltaTime,
      });
      this._pool.set(id, syncedSocket);
      this.emit('connection', syncedSocket);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private handleQuietDeath(socket: WebSocket) {
    const send = createSender(socket);
    let timeout: NodeJS.Timeout;
    const interval = setInterval(() => {
      send({ actionType: PING });
      timeout = setTimeout(() => {
        socket.terminate();
        clearInterval(interval);
      }, REMOVE_DEAD_TIMEOUT);
    }, CHECK_FOR_DEAD_INTERVAL);
    socket.on('message', (message: string) => {
      const { actionType } = JSON.parse(message);
      if (actionType === PONG) {
        clearTimeout(timeout);
      }
    });
  }

  private handleMessage(id: string) {
    return (message: string) =>
      this.emit('message', JSON.parse(message), this._pool.get(id));
  }

  private handleClose(socket: WebSocket, id: string) {
    return () => {
      // eslint-disable-next-line no-param-reassign
      (socket as any).isOpen = false;
      this._pool.delete(id);
      this.emit('close', id);
    };
  }

  on(event: 'connection', handler: (socket: Socket) => void): void;

  // eslint-disable-next-line no-dupe-class-members
  on(
    event: 'message',
    handler: (message: any, socket: Socket) => void,
  ): void;

  // eslint-disable-next-line no-dupe-class-members
  on(event: 'close', handler: (id: string) => void): void;

  // eslint-disable-next-line no-dupe-class-members
  on(event: string, handler: (...data: any[]) => void): void;

  // eslint-disable-next-line no-dupe-class-members
  on(event: string, handler: (...data: any[]) => void): void {
    super.on(event, handler);
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

  send(message: any) {
    this.sendAll(message);
  }
}

export default Pool;
