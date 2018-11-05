import envResult from 'dotenv';
import express from 'express';
import localIP from 'my-local-ip';
import UserDB from './UserDB';

import configureUserDB from './userDBConfig';
import configureApp from './appConfig';
import authenticate from './routes/authenticate';
import start from './routes/start';
import stop from './routes/stop';
import wshost from './routes/wshost';
import startWebSocket from './ws';

// Check for errors parsing .env file
envResult.load();
if (envResult.error) throw envResult.error;

const PORT = 3000;
const localHostname = process.env.PRODUCTION === 'true' ? '3.120.26.9' : localIP();
const app = express();
const clients = new Map();
const userDB = new UserDB();

configureUserDB(userDB);
configureApp(app, express);
authenticate(app, userDB);
start(app, clients);
stop(app, clients);
wshost(app, localHostname);
startWebSocket(clients);

app.listen(PORT, () => console.log(
  '\n' +
  `Client Seite auf http://${localHostname}:${PORT} aufrufen.\n` +
  `Steuerung der Animation unter http://${localHostname}:${PORT}/master.\n`,
));
