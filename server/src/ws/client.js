import WebSocket from 'ws';
import createkeyGenerator from '../util/keyGen';
import createSender from '../util/createSender';
import { POSITION } from '../../../shared/util/socketActionTypes';
import onMessage from './onMessage';
import syncTime from './syncTime';

const wsServer = new WebSocket.Server({ port: 8888 });
const keyGen = createkeyGenerator();

const startWebSocket = clients => wsServer.on('connection', (socket) => {
  const send = createSender(socket);
  const id = keyGen.generate();

  socket.isOpen = true;

  syncTime(socket).then((deltaTime) => {
    clients.set(id, { id, deltaTime, socket });
    send({ actionType: POSITION });
  });

  onMessage(socket, (message) => {
    if (message.actionType === POSITION) {
      const { x, y } = message;
      const client = clients.get(id);
      client.x = Number(x);
      client.y = Number(y);
      console.log(`${id} x=${x}, y=${y}, deltaTime=${client.deltaTime}`);
    }
  });

  socket.on('close', () => {
    socket.isOpen = false;
    clients.delete(id);
    console.log('close connection', id);
  });
});

export default startWebSocket;
