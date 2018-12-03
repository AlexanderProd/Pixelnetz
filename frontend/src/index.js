import '../polyfills';
import baseUrl from '../../shared/util/baseUrl';
import createSender from '../../shared/util/createSender';
import runConfigDialogs from './dialogs';
import './index.sass';

const main = async () => {
  runConfigDialogs();

  const createActionRunner = (await import('./actions')).default;
  const { hostname } = await (fetch(`${baseUrl()}/wshost`).then(r => r.json()));
  const socket = new WebSocket(`ws://${hostname}:3001`);
  const send = createSender(socket);
  const runAction = createActionRunner(send);

  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    runAction(message);
  };
};

main();
