const { STOP_ANIMATION } = require('../../../util/socketActionTypes');
const { createSender } = require('../../../util/createSender');
const withAuth = require('../util/authMiddleware');

module.exports = (app, clients) => app.get('/stop', withAuth, (req, res) => {
  for (const { id, socket } of clients.values()) {
    const send = createSender(socket);
    setTimeout(() => {
      console.log('stop: ', id);
      send({ actionType: STOP_ANIMATION });
    }, 0);
  }

  res.sendStatus(200);
});
