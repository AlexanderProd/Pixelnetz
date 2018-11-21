import '@babel/polyfill';
import envResult from 'dotenv';
import express from 'express';
import localIP from 'my-local-ip';
import UserDB from './UserDB';

import configureUserDB from './userDBConfig';
import configureApp from './appConfig';
import authenticate from './routes/authenticate';
import start from './routes/start';
import stop from './routes/stop';
import setAnimation from './routes/setAnimation';
import upload from './routes/upload';
import wshost from './routes/wshost';
import createClientPool from './ws/client';
import withAuth from './util/authMiddleware';

// Check for errors parsing .env file
envResult.load();
if (envResult.error) throw envResult.error;

const PORT = 3000;
const localHostname = process.env.PRODUCTION === 'true' ? '3.121.177.95' : localIP();
const app = express();
const clients = createClientPool();
const userDB = new UserDB();

configureUserDB(userDB);
configureApp(app, express);

app.post('/authenticate', authenticate(userDB));
app.get('/start', withAuth, start(clients));
app.get('/stop', withAuth, stop(clients));
app.get('/setAnimation', withAuth, setAnimation(clients));
app.post('/upload', withAuth, upload());
app.get('/wshost', wshost(localHostname));

app.listen(PORT, () => console.log(
  '\n' +
  `Client Seite auf http://${localHostname}:${PORT} aufrufen.\n` +
  `Steuerung der Animation unter http://${localHostname}:${PORT}/master.\n`,
));
