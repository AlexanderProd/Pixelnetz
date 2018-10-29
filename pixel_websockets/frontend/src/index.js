import '../../polyfills';
import baseUrl from '../../util/baseUrl';

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

  socket.onmessage = ({ data }) => {
    const res = JSON.parse(data);
    if (res.id) {
      socket.send(JSON.stringify({ x, y }));
    }

    if (res.animation) {
      if (res.on) on();
      else off();
    }

    if (res.serverTime) {
      const serverTime = res.serverTime;
      const localTime = Date.now();
      console.log(`${localTime - serverTime} milliseconds behind server.`);
    }

    console.log(res);
  };
};

main();
