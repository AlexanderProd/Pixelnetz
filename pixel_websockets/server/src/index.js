const express = require('express');
const localIP = require('my-local-ip');

const PORT = 3000;
const localHostname = process.env.PRODUCTION === 'true' ? '3.120.26.9' : localIP();
const app = express();
const clients = new Map();

require('./appConfig.js')(app, express);
require('./routes/start.js')(app, clients);
require('./routes/stop.js')(app, clients);
require('./routes/wshost.js')(app, localHostname);
require('./ws.js')(clients);

app.listen(PORT, async () => {
  console.log(
    '\n' +
    `Client Seite auf http://${localHostname}:${PORT} aufrufen.\n` +
    `Steuerung der Animation unter http://${localHostname}:${PORT}/master.\n`,
  );
});
