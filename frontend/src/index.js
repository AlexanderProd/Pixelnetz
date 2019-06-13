import 'array-reverse-polyfill';
import '../runtime';
import createSender from '../../shared/dist/util/createSender';
import runConfigDialogs from './dialogs';
import BASE_URL from './util/baseUrl';
import './index.sass';

const main = async () => {
  const actionsImport = import(
    /* webpackChunkName: 'actions' */ './actions'
  );

  runConfigDialogs();

  const createActionRunner = (await actionsImport).default;
  const socket = new WebSocket(`ws://${BASE_URL}/`);
  const send = createSender(socket);
  const runAction = createActionRunner(send);

  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    runAction(message);
  };
};

main();
