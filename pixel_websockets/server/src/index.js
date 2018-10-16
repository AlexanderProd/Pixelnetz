const express = require('express');

const app = express();
const clients = new Map();

require('./appConfig.js')(app);
require('./routes/start.js')(app, clients);
require('./ws.js')(clients);

app.listen(3000, () => {
  console.log('listening on port 3000...');
});
