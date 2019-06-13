import 'array-reverse-polyfill';
import '../runtime';
import createSender from '../../shared/dist/util/createSender';
import runConfigDialogs from './dialogs';
import BASE_URL from './util/baseUrl';
import './index.sass';

const main = async () => {
  runConfigDialogs();

  const createActionRunner = (await import('./actions')).default;
  const socket = new WebSocket(`ws://${BASE_URL}/`);
  const send = createSender(socket);
  const runAction = createActionRunner(send);

  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    runAction(message);
  };
};

main();
