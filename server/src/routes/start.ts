import { Request, Response } from 'express';
import { START_ANIMATION } from '../../../shared/src/util/socketActionTypes';
import Pool from '../ws/Pool';

const start = (socketPools: Pool[]) => (
  req: Request,
  res: Response,
) => {
  const startTime = Date.now() + 3000;

  socketPools.forEach(pool =>
    pool.forEach(socket => {
      console.log('start: ', socket.id());
      socket.send({
        actionType: START_ANIMATION,
        startTime: startTime + socket.deltaTime(),
      });
    }),
  );

  res.sendStatus(200);
};

export default start;
