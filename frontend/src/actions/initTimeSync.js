const initTimeSync = send => (message) => {
  send({
    initCounter: message.initCounter,
    clientReceive: Date.now(),
  });
};

export default initTimeSync;
