const WebSocket = require('ws');
const keyGen = require('./util/keyGen.js');

const wsServer = new WebSocket.Server({ port: 8888 });

module.exports = clients => wsServer.on('connection', (ws) => {
  const id = keyGen.generate();
  
  ws.isOpen = true;
  ws.send(JSON.stringify({ id }));

  ws.on('message', (message) => {
    const { x, y } = JSON.parse(message);
    console.log(`${id} x=${x}, y=${y}`);

    clients.set(id, { id, ws, x, y });
  });

  ws.on('close', () => {
    ws.isOpen = false;
    const del = clients.delete(id);
    console.log('close connection', id);
  });
});
 