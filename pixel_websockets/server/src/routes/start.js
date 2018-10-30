const { START_ANIMATION, STOP_ANIMATION } = require('../../../util/socketActionTypes');
const { createSender } = require('../../../util/createSender');

module.exports = (app, clients) => {
  app.get('/start', (req, res) => {
    for (const { id, socket, deltaTime } of clients.values()) {
      const send = createSender(socket);
      setTimeout(() => {
        console.log('starting: ', id);
        send({
          actionType: START_ANIMATION,
          startTime: Date.now() + 3000 + deltaTime,
        });
      }, 0);
    }

    res.sendStatus(200);
  });

  app.get('/stop', (req, res) => {
    res.sendStatus(200);
  });
};
