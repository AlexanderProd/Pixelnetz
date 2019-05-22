import { Request, Response } from 'express';
import { STOP_ANIMATION } from '../../../shared/dist/util/socketActionTypes';
import Pool from '../ws/Pool';

const stop = (socketPools: Pool[]) => (
  req: Request,
  res: Response,
) => {
  socketPools.forEach(pool =>
    pool.forEach(socket => {
      console.log('stop: ', socket.id());
      socket.send({ actionType: STOP_ANIMATION });
    }),
  );

  res.sendStatus(200);
};

export default stop;
