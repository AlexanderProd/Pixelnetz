const WebSocket = require('ws');
const keyGen = require('./util/keyGen.js');
const { createSender } = require('../../util/createSender');
const {
  INIT_TIME_SYNC,
  POSITION,
} = require('../../util/socketActionTypes');

const MAX_INIT_COUNTER = 10;
const wsServer = new WebSocket.Server({ port: 8888 });

const createPingAndSaveTime = send => (initCounter, timeStamp) => {
  send({ initCounter, actionType: INIT_TIME_SYNC });
  return { serverStart: timeStamp };
};

module.exports = clients => wsServer.on('connection', (ws) => {
  const send = createSender(ws);
  const pingAndSaveTime = createPingAndSaveTime(send);
  const id = keyGen.generate();

  ws.isOpen = true;

  const timeStamps = [];
  let initCounter = 0;

  // Zeit sync starten
  timeStamps.push(pingAndSaveTime(initCounter, Date.now()));
  initCounter += 1;

  ws.on('message', (jsonMessage) => {
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

      clients.set(id, { id, deltaTime, ws });

      send({ actionType: POSITION });
    } else {
      const { x, y } = message;
      const client = clients.get(id);
      client.x = x;
      client.y = y;
      console.log(`${id} x=${x}, y=${y}, deltaTime=${client.deltaTime}`);
    }
  });

  ws.on('close', () => {
    ws.isOpen = false;
    clients.delete(id);
    console.log('close connection', id);
  });
});
