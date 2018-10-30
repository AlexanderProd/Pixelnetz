const { START_ANIMATION } = require('../../../util/socketActionTypes');
const { createSender } = require('../../../util/createSender');

module.exports = (app, clients) => app.get('/start', (req, res) => {
  for (const { id, socket, deltaTime } of clients.values()) {
    const send = createSender(socket);
    setTimeout(() => {
      console.log('start: ', id);
      send({
        actionType: START_ANIMATION,
        startTime: Date.now() + 3000 + deltaTime,
      });
    }, 0);
  }

  res.sendStatus(200);
});
