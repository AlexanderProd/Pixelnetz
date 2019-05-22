import WebSocket from 'ws';

const createSender = (socket: WebSocket) => (data: any) => {
  if ((socket as any).isOpen) {
    socket.send(JSON.stringify(data));
  }
};

export default createSender;
