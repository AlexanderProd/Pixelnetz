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

(async () => {
  const { x, y } = extractPosition();
  const { hostname } = await (fetch('/wshost').then(r => r.json()));
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
  
    console.log(res);
  };
})();
