import test from 'ava';
import { mockRes } from 'sinon-express-mock';
import { spy, SinonSpyStatic } from 'sinon';
import stop from './stop';
import { STOP_ANIMATION } from '../../../shared/dist/util/socketActionTypes';

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

class MockPool {
  private socketSpyes: MockSocket[];

  constructor(socketSpys: SinonSpyStatic[] = []) {
    this.socketSpyes = socketSpys.map(spy => new MockSocket(spy));
  }

  forEach(cb: (socket: MockSocket) => any): void {
    this.socketSpyes.forEach(cb);
  }
}

test('stop: sends status 200', t => {
  const res = mockRes();

  stop([new MockPool()])(null, res);

  t.true(res.sendStatus.calledOnceWith(200));
});

test('stop: sends STOP_ANIMATION action to ws', async t => {
  const mockSend = spy();
  const clients = new MockPool([mockSend]);

  stop([clients])(null, mockRes());

  await wait();

  t.true(mockSend.calledOnceWith({ actionType: STOP_ANIMATION }));
});
