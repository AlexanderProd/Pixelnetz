import createSender from '../util/createSender';

const createSocket = ({
  socket,
  id,
  deltaTime,
}) => ({
  send: createSender(socket),
  id: () => id,
  deltaTime: () => deltaTime,
  properties: {},
});

export default createSocket;
