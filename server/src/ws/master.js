import Pool from './Pool';

const createMasterPool = (server) => {
  const masterPool = new Pool({ server, path: '/master' });

  masterPool.on('connection', (socket) => {
    console.log(`MASTER: ${socket.id()} deltaTime=${socket.deltaTime()}`);
  });

  return masterPool;
};

export default createMasterPool;
