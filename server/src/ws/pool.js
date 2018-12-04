import url from 'url';
import WebSocket from 'ws';
import createkeyGenerator from '../util/keyGen';
import syncTime from './syncTime';
import createSocket from './socket';
import onMessage from './onMessage';

const createPool = ({ server, path }) => {
  const wsServer = new WebSocket.Server({ noServer: true });
  const keyGen = createkeyGenerator();
  const pool = new Map();

  server.on('upgrade', (req, socket, head) => {
    const { pathname } = url.parse(req.url);
    if (pathname === path) {
      wsServer.handleUpgrade(
        req,
        socket,
        head,
        ws => wsServer.emit('connection', ws, req),
      );
    }
  });

  const connectionHandlers = [];
  const messageHandlers = [];
  const closeHandlers = [];

  wsServer.on('connection', (socket, req) => {
    const id = keyGen.generate();
    const ip = req.connection.remoteAddress;
    socket.isOpen = true;

    syncTime(socket).then((deltaTime) => {
      const syncedSocket = createSocket({ socket, id, ip, deltaTime });
      pool.set(id, syncedSocket);
      connectionHandlers.forEach(handler => handler(syncedSocket));
    });

    onMessage(socket, message => messageHandlers.forEach(
      handler => handler(message, pool.get(id))),
    );

    socket.on('close', () => {
      socket.isOpen = false;
      pool.delete(id);
      console.log('close connection', id);
      closeHandlers.forEach(handler => handler(id));
    });
  });

  const forEachSync = (callback) => {
    for (const socket of pool.values()) {
      callback(socket);
    }
  };

  const forEach = (callback) => {
    for (const socket of pool.values()) {
      setTimeout(() => {
        callback(socket);
      }, 0);
    }
  };

  const sendAll = message => forEach(socket => socket.send(message));

  return {
    forEachSync,
    forEach,
    onConnection: (callback) => {
      connectionHandlers.push(callback);
    },
    onMessage: (callback) => {
      messageHandlers.push(callback);
    },
    onClose: (callback) => {
      closeHandlers.push(callback);
    },
    sendAll,
    size: () => pool.size(),
  };
};

export default createPool;
