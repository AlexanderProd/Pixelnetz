import { STOP_ANIMATION } from '../../../shared/util/socketActionTypes';
import createSender from '../util/createSender';

const stop = clients => (req, res) => {
  for (const { id, socket } of clients.values()) {
    const send = createSender(socket);
    setTimeout(() => {
      console.log('stop: ', id);
      send({ actionType: STOP_ANIMATION });
    }, 0);
  }

  res.sendStatus(200);
};

export default stop;
