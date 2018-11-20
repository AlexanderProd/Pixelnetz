import { START_ANIMATION } from '../../../shared/util/socketActionTypes';
import createSender from '../util/createSender';

const start = clients => (req, res) => {
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
};

export default start;
