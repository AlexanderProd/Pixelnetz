const onMessage = (socket, handler) =>
  socket.on(
    'message',
    message => handler(JSON.parse(message)),
  );

export default onMessage;
