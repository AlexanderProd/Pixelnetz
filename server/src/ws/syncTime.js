import onMessage from './onMessage';
import createSender from '../util/createSender';
import { INIT_TIME_SYNC } from '../../../shared/dist/util/socketActionTypes';

const MAX_INIT_COUNTER = 16;

const createPingAndSaveTime = send => (initCounter, timeStamp) => {
  send({ initCounter, actionType: INIT_TIME_SYNC });
  return { serverStart: timeStamp };
};

const syncTime = (socket) => new Promise((resolve) => {
  const send = createSender(socket);
  const pingAndSaveTime = createPingAndSaveTime(send);

  const timeStamps = [];
  let initCounter = 0;

  // Zeit sync starten
  timeStamps.push(pingAndSaveTime(initCounter, Date.now()));
  initCounter += 1;

  onMessage(socket, (message) => {
    const isInitMessage = message.actionType === INIT_TIME_SYNC;

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
      resolve(deltaTime);
    }
  });
});

export default syncTime;
