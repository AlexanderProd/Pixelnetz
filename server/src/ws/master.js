import createPool from './pool';

const createMasterPool = (server) => {
  const masterPool = createPool({ server, path: '/master' });

  masterPool.onConnection((socket) => {
    console.log(`MASTER: ${socket.id()} deltaTime=${socket.deltaTime()}`);
  });

  return masterPool;
};

export default createMasterPool;
