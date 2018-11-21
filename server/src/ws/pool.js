import WebSocket from 'ws';
import createkeyGenerator from '../util/keyGen';
import syncTime from './syncTime';
import createSocket from './socket';

const createPool = ({ port }) => {
  const wsServer = new WebSocket.Server({ port });
  const keyGen = createkeyGenerator();
  const pool = new Map();

  let onConnection = null;
  let onMessage = null;
  let onClose = null;

  wsServer.on('connection', (socket) => {
    const id = keyGen.generate();
    socket.isOpen = true;

    syncTime(socket).then((deltaTime) => {
      const syncedSocket = createSocket({ socket, id, deltaTime });
      pool.set(id, syncedSocket);
      if (onConnection) {
        onConnection(syncedSocket);
      }
    });

    if (onMessage) {
      socket.on(
        'message',
        message => onMessage(JSON.parse(message), pool.get(id)),
      );
    }

    socket.on('close', () => {
      socket.isOpen = false;
      pool.delete(id);
      console.log('close connection', id);
      if (onClose) {
        onClose(id);
      }
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
      onConnection = callback;
    },
    onMessage: (callback) => {
      onMessage = callback;
    },
    onClose: (callback) => {
      onClose = callback;
    },
    sendAll,
    size: () => pool.size(),
  };
};

export default createPool;
