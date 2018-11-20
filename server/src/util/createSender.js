const createSender = socket => (data) => {
  if (socket.isOpen) {
    socket.send(JSON.stringify(data));
  }
};

export default createSender;
