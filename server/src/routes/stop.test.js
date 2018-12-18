import { expect } from 'chai';
import { mockRes } from 'sinon-express-mock';
import { spy } from 'sinon';
import stop from './stop';
import { STOP_ANIMATION } from '../../../shared/dist/util/socketActionTypes';

const wait = (ms = 0) => new Promise(res => setTimeout(res, ms));

describe('stop', () => {
  it('sends status 200', () => {
    const res = mockRes();

    stop(new Map())(null, res);

    expect(res.sendStatus).to.be.calledWith(200);
  });

  it('sends STOP_ANIMATION action to ws', async () => {
    const clients = new Map();
    const id = 'testId';
    const socket = {
      send: spy(),
    };

    clients.set(id, { id, socket });

    stop(clients)(null, mockRes());

    await wait();

    expect(socket.send).to.be.calledWith(JSON.stringify({ actionType: STOP_ANIMATION }));
  });
});
