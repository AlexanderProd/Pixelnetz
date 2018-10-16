const WebSocket = require('ws');
const keyGen = require('./util/keyGen.js');

const wsServer = new WebSocket.Server({ port: 8888 });

module.exports = clients => wsServer.on('connection', (ws) => {
  const id = keyGen.generate();
  
  ws.send(JSON.stringify({ id, t: Date.now() }));

  ws.on('message', (message) => {
    const { x, y, t } = JSON.parse(message);
    console.log(x, y, t);

    clients.set(`${x},${y}`, {
      id,
      ws,
      x,
      y,
      dt: Date.now() - t,
    });
  });
});
 