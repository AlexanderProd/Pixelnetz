import WebSocket from 'ws';

const onMessage = (
  socket: WebSocket,
  handler: (message: any) => void,
) =>
  socket.on('message', (message: string) =>
    handler(JSON.parse(message)),
  );

export default onMessage;
