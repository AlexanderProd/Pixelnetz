const ANIM_SPEED = 1000;

module.exports = (app, clients) => {
  let intervals = [];

  app.get('/start', (req, res) => {
    for (const [key, value] of clients) {
      clients.get(key).sequence = Number(value.x) % 2 === 0
        ? [true, false]
        : [false, true];
    }

    for (const { id, ws, sequence } of clients.values()) {
      setTimeout(() => {
        console.log('starting: ', id);
        let i = 0;
        const sequenceInterval = setInterval(() => {
          console.log(id, sequence[i % sequence.length]);
          if (ws.isOpen) {
            ws.send(JSON.stringify({
              animation: true,
              on: sequence[i % sequence.length],
              serverTime: Date.now(),
            }));
          }
          i++;
        }, ANIM_SPEED);
        intervals.push(sequenceInterval);
      }, 0);
    }

    res.json(JSON.stringify({ start: true }));
  });

  app.get('/stop', (req, res) => {
    intervals.forEach(interval => clearInterval(interval));
    intervals = [];
    res.json(JSON.stringify({ stop: true }));
  });
};
