const createSender = socket => data => socket.send(JSON.stringify(data));

module.exports = createSender;
