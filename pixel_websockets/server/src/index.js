const express = require('express');
const hostname = require('./util/hostname.js');

(async () => {
  const PORT = 3000;
  const localHostname = await hostname();
  const app = express();
  const clients = new Map();
  
  require('./appConfig.js')(app, express);
  require('./routes/start.js')(app, clients);
  require('./routes/wshost.js')(app, localHostname);
  require('./ws.js')(clients);
  
  app.listen(PORT, async () => {
    console.log(`view app at localhost:${PORT} or ${localHostname}:${PORT}`);
  });
})();
