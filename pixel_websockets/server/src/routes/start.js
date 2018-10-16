const ANIM_SPEED = 1000;
const animation = [
  true,
  false,
  false,
  false,
  true,
  false,
  true,
  true,
  false,
];

module.exports = (app, clients) => app.get('/start', (req, res) => {
  for (const [key, value] of clients) {
    console.log(Number(value.x));
    clients.get(key).sequence = Number(value.x) % 2 === 0
      ? [true, false]
      : [false, true];
  }

  for (const { id, ws, sequence } of clients.values()) {
    console.log('starting: ', id);
    setTimeout(() => {
      console.log('setTimeout ', id);
      let i = 0;
      setInterval(() => {
        console.log(id, sequence[i % sequence.length]);
        ws.send(JSON.stringify({
          animation: true,
          on: sequence[i % sequence.length],
        }));
        i++;
      }, ANIM_SPEED);
    }, 0);
  }

  res.send('ok!');
});
