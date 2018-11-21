import createPool from './pool';

const createMasterPool = () => {
  const masterPool = createPool({ port: 3002 });

  masterPool.onConnection((socket) => {
    console.log(`MASTER: ${socket.id()} deltaTime=${socket.deltaTime()}`);
  });

  return masterPool;
};

export default createMasterPool;
