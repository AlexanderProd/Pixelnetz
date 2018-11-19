import WebSocket from 'ws';
import keyGen from './util/keyGen.js';
import createSender from '../../shared/util/createSender';
import {
  INIT_TIME_SYNC,
  POSITION,
} from '../../shared/util/socketActionTypes';

const MAX_INIT_COUNTER = 16;
const wsServer = new WebSocket.Server({ port: 8888 });

const createPingAndSaveTime = send => (initCounter, timeStamp) => {
  send({ initCounter, actionType: INIT_TIME_SYNC });
  return { serverStart: timeStamp };
};

const startWebSocket = clients => wsServer.on('connection', (socket) => {
  const send = createSender(socket);
  const pingAndSaveTime = createPingAndSaveTime(send);
  const id = keyGen.generate();

  socket.isOpen = true;

  const timeStamps = [];
  let initCounter = 0;

  // Zeit sync starten
  timeStamps.push(pingAndSaveTime(initCounter, Date.now()));
  initCounter += 1;

  socket.on('message', (jsonMessage) => {
    // JSON.parse: js object from json string
    const message = JSON.parse(jsonMessage);

    const isInitMessage = message.hasOwnProperty('initCounter');

    if (isInitMessage && message.initCounter < MAX_INIT_COUNTER) {
      const currentTimeValues = timeStamps[timeStamps.length - 1];
      currentTimeValues.serverReceive = Date.now();
      currentTimeValues.clientReceive = message.clientReceive;

      timeStamps.push(pingAndSaveTime(initCounter, Date.now()));
      initCounter += 1;
    } else if (isInitMessage) {
      // letzten halben Eintrag entfernen
      timeStamps.pop();
      const sum = timeStamps
        .map(({ serverStart, serverReceive, clientReceive }) => {
          const expectedClientReceive = serverStart + ((serverReceive - serverStart) / 2);
          return clientReceive - expectedClientReceive;
        })
        .reduce((acc, diff) => (acc + diff), 0);

      const deltaTime = sum / timeStamps.length;

      clients.set(id, { id, deltaTime, socket });

      send({ actionType: POSITION });
    } else {
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
