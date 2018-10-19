const express = require('express');
const hostname = require('./util/hostname.js');

const PORT = 3000;
const app = express();
const clients = new Map();

require('./appConfig.js')(app, express);
require('./routes/start.js')(app, clients);
require('./ws.js')(clients);

app.listen(PORT, async () => {
  console.log(`view app at localhost:${PORT} or ${await hostname()}:${PORT}`);
});
