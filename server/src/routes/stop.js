// import { STOP_ANIMATION } from '../util/socketActionTypes';
import { STOP_ANIMATION } from '../../../shared/util/socketActionTypes';
import createSender from '../../../shared/util/createSender';
import withAuth from '../util/authMiddleware';

const stop = (app, clients) => app.get('/stop', withAuth, (req, res) => {
  for (const { id, socket } of clients.values()) {
    const send = createSender(socket);
    setTimeout(() => {
      console.log('stop: ', id);
      send({ actionType: STOP_ANIMATION });
    }, 0);
  }

  res.sendStatus(200);
});

export default stop;
