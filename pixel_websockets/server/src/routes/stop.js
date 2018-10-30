const { STOP_ANIMATION } = require('../../../util/socketActionTypes');
const { createSender } = require('../../../util/createSender');

module.exports = (app, clients) => app.get('/stop', (req, res) => {
  for (const { id, socket } of clients.values()) {
    const send = createSender(socket);
    setTimeout(() => {
      console.log('stop: ', id);
      send({ actionType: STOP_ANIMATION });
    }, 0);
  }

  res.sendStatus(200);
});
