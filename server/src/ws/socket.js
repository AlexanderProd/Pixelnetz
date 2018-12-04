import createSender from '../util/createSender';

const createSocket = ({
  socket,
  id,
  ip,
  deltaTime,
}) => {
  const properties = {};
  const joinTime = Date.now();

  return {
    send: createSender(socket),
    id: () => id,
    ip: () => ip,
    deltaTime: () => deltaTime,
    joinTime: () => joinTime,
    properties,
    info: () => ({
      deltaTime,
      id,
      ip,
      joinTime,
      properties,
    }),
  };
};

export default createSocket;
