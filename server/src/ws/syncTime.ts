import WebSocket from 'ws';
import createSender from '../util/createSender';
import { INIT_TIME_SYNC } from '../../../shared/src/util/socketActionTypes';

interface TimeStamp {
  serverStart: number;
  serverReceive: number;
  clientReceive: number;
}

const NUM_RUNS = 3;
const WAIT_TIME = 300;
const MAX_INIT_COUNTER = 16;

const createPingAndSaveTime = (send: (data: any) => void) => (
  initCounter: number,
  timeStamp: number,
): Partial<TimeStamp> => {
  send({ initCounter, actionType: INIT_TIME_SYNC });
  return { serverStart: timeStamp };
};

function syncTimeOnce(socket: WebSocket): Promise<number> {
  return new Promise(resolve => {
    const send = createSender(socket);
    const pingAndSaveTime = createPingAndSaveTime(send);

    const timeStamps: Partial<TimeStamp>[] = [];
    let initCounter = 0;

    // Zeit sync starten
    timeStamps.push(pingAndSaveTime(initCounter, Date.now()));
    initCounter += 1;

    const handler = (json: string) => {
      const message = JSON.parse(json);
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
          .map(timeStamp => {
            const {
              serverStart,
              serverReceive,
              clientReceive,
            } = timeStamp as TimeStamp;
            const expectedClientReceive =
              serverStart + (serverReceive - serverStart) / 2;
            return clientReceive - expectedClientReceive;
          })
          .reduce((acc, diff) => acc + diff, 0);

        const deltaTime = sum / timeStamps.length;
        socket.off('message', handler);
        resolve(deltaTime);
      }
    };

    socket.on('message', handler);
  });
}

async function syncTime(socket: WebSocket): Promise<number> {
  const diffs = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < NUM_RUNS; i++) {
    if (i !== 0) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise(res => setTimeout(res, WAIT_TIME));
    }
    // eslint-disable-next-line no-await-in-loop
    const diff = await syncTimeOnce(socket);
    diffs.push(diff);
  }
  return diffs.sort((a, b) => a - b)[Math.floor(NUM_RUNS / 2)];
}

export default syncTime;
