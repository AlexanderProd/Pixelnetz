import '../../polyfills';
import baseUrl from '../../util/baseUrl';
import { createSender } from '../../util/createSender';

const on = () => document.body.style = 'background: white;';
const off = () => document.body.style = 'background: black;';

const extractPosition = () => window.location.search
  .substring(1)
  .split('&')
  .map(x => x.split('='))
  .reduce((acc, [key, val]) => ({
    ...acc,
    [key]: val,
  }), {});

const main = async () => {
  const { x, y } = extractPosition();
  const { hostname } = await (fetch(`${baseUrl()}/wshost`).then(r => r.json()));
  const wsUrl = `ws://${hostname}:8888`;
  const socket = new WebSocket(wsUrl);
  const send = createSender(socket);

  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.hasOwnProperty('initCounter')) {
      console.log('initCounter');
      send({
        initCounter: message.initCounter,
        clientReceive: Date.now(),
      });
    }

    if (message.position) {
      send({ x, y });
    }

    if (message.animation) {
      if (message.on) on();
      else off();
    }

    if (message.serverTime) {
      const serverTime = message.serverTime;
      const localTime = Date.now();
      console.log(`${localTime - serverTime} milliseconds behind server.`);
    }

    console.log(message);
  };
};

main();
