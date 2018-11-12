import { expect } from 'chai';
import { mockRes } from 'sinon-express-mock';
import wshost from './wshost';

describe('wshost', () => {
  it('sends hostname object', () => {
    const res = mockRes();
    const hostname = 'testHost';

    wshost(hostname)(null, res);

    expect(res.json).to.be.calledWith({ hostname });
  });
});
