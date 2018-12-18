import { STOP_ANIMATION } from '../../../shared/dist/util/socketActionTypes';

const stop = clients => (req, res) => {
  clients.forEach((socket) => {
    console.log('stop: ', socket.id());
    socket.send({ actionType: STOP_ANIMATION });
  });

  res.sendStatus(200);
};

export default stop;
