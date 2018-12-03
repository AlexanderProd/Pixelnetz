import '../polyfills';
import createSender from '../../shared/util/createSender';
import runConfigDialogs from './dialogs';
import './index.sass';

const main = async () => {
  runConfigDialogs();

  const createActionRunner = (await import('./actions')).default;
  // HOSTNAME kommt aus webpack.DefinePlugin und wird im Buildprozess gesetzt
  // eslint-disable-next-line no-undef
  const socket = new WebSocket(`ws://${HOSTNAME}:3001`);
  const send = createSender(socket);
  const runAction = createActionRunner(send);

  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    runAction(message);
  };
};

main();
