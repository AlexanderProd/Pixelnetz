import dotenv from 'dotenv';
import * as http from 'http';
import express from 'express';
import localIP from './@types/my-local-ip';
import UserDB from './UserDB';
import { isProd } from './util/env';
import configureUserDB from './config/userDBConfig';
import configureApp from './config/appConfig';
import authenticate from './routes/authenticate';
import start from './routes/start';
import stop from './routes/stop';
import setSequence from './routes/setSequence';
import upload from './routes/upload';
import savedFiles from './routes/savedFiles';
import deleteSequence from './routes/deleteSequence';
import ClientPool from './ws/ClientPool';
import MasterPool from './ws/MasterPool';
import withAuth from './util/authMiddleware';
import setupLiveData from './config/setupLiveData';
import createLogMessage from './createLogMessage';
import AudioDB from './audio/AudioDB';
import uploadAudio from './routes/uploadAudio';
import deleteAudio from './routes/deleteAudio';

// Check for errors parsing .env file
const envResult = dotenv.load();
if (envResult.error) throw envResult.error;

const app = express();
const server = http.createServer({}, app);
const PORT = isProd()
  ? Number(process.env.SERVER_PORT) || 3080
  : 3000;
const localHostname = isProd()
  ? process.env.SERVER_HOSTNAME || 'bepartoftheshow.de'
  : localIP();
const masterPool = new MasterPool(server);
const clientPool = new ClientPool(server);
const userDB = new UserDB();
const audioDB = new AudioDB();

configureUserDB(userDB);
configureApp(app);
setupLiveData({ masterPool, clientPool, audioDB });

app.post('/authenticate', authenticate(userDB));
app.get('/start', withAuth, start([clientPool, masterPool]));
app.get('/stop', withAuth, stop([clientPool, masterPool]));
app.get(
  '/setAnimation',
  withAuth,
  setSequence(clientPool, masterPool),
);
app.post('/upload', withAuth, upload(masterPool));
app.post('/uploadAudio', withAuth, uploadAudio(masterPool, audioDB));
app.get('/savedFiles', withAuth, savedFiles());
app.get('/deleteSequence', withAuth, deleteSequence(masterPool));
app.get('/deleteAudio', withAuth, deleteAudio(masterPool, audioDB));

server.listen(PORT, () =>
  console.log(createLogMessage(localHostname, PORT)),
);
