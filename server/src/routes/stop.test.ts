import test from 'ava';
import { Request } from 'express';
import { mockRes } from 'sinon-express-mock';
import { spy, SinonSpyStatic } from 'sinon';
import stop from './stop';
import { STOP_ANIMATION } from '../../../shared/dist/util/socketActionTypes';
import Emitter from '../ws/Emitter';
import Pool from '../ws/Pool';

const wait = (ms = 0) => new Promise(res => setTimeout(res, ms));

class MockSocket {
  public send: SinonSpyStatic;

  private socketId: string;

  constructor(sendSpy: SinonSpyStatic) {
    this.send = sendSpy;
    this.socketId = `mock_socket_id$${Date.now()}`;
  }

  id(): string {
    return this.socketId;
  }
}

class MockPool extends Emitter {
  private socketSpyes: MockSocket[];

  private _pool = new Map();

  constructor(socketSpys: SinonSpyStatic[] = []) {
    super();
    this.socketSpyes = socketSpys.map(
      socketSpy => new MockSocket(socketSpy),
    );
  }

  forEach(cb: (socket: MockSocket) => any): void {
    this.socketSpyes.forEach(cb);
  }

  forEachSync(cb: (socket: MockSocket) => any): void {
    this.forEach(cb);
  }

  size(): number {
    return this.socketSpyes.length;
  }
}

function mockPool(socketSpys?: SinonSpyStatic[]): Pool {
  return (new MockPool(socketSpys) as unknown) as Pool;
}

test('stop: sends status 200', t => {
  const res = mockRes();

  // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
  stop([mockPool()])({} as Request, res);

  t.true(res.sendStatus.calledOnceWith(200));
});

test('stop: sends STOP_ANIMATION action to ws', async t => {
  const mockSend = spy();
  const clients = mockPool([mockSend]);

  // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
  stop([clients])({} as Request, mockRes());

  await wait();

  t.true(mockSend.calledOnceWith({ actionType: STOP_ANIMATION }));
});
