import { START_ANIMATION } from '../../../shared/util/socketActionTypes';

const start = clients => (req, res) => {
  clients.forEach((socket) => {
    console.log('start: ', socket.id());
    socket.send({
      actionType: START_ANIMATION,
      startTime: Date.now() + 3000 + socket.deltaTime(),
    });
  });

  res.sendStatus(200);
};

export default start;
