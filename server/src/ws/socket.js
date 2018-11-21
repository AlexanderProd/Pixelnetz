import createSender from '../util/createSender';

const createSocket = ({
  socket,
  id,
  deltaTime,
}) => {
  const properties = {};
  const joinTime = Date.now();

  return {
    send: createSender(socket),
    id: () => id,
    deltaTime: () => deltaTime,
    joinTime: () => joinTime,
    properties,
    info: () => ({
      deltaTime,
      id,
      joinTime,
      properties,
    }),
  };
};

export default createSocket;
