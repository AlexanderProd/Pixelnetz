import { START_ANIMATION } from '../../../shared/dist/util/socketActionTypes';

const start = socketPools => (req, res) => {
  const startTime = Date.now() + 3000;

  socketPools.forEach(pool => pool.forEach((socket) => {
    console.log('start: ', socket.id());
    socket.send({
      actionType: START_ANIMATION,
      startTime: startTime + socket.deltaTime(),
    });
  }));

  res.sendStatus(200);
};

export default start;
