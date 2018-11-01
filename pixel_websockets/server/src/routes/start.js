const { START_ANIMATION } = require('../../../util/socketActionTypes');
const { createSender } = require('../../../util/createSender');
const withAuth = require('../util/authMiddleware');

module.exports = (app, clients) => app.get('/start', withAuth, (req, res) => {
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
