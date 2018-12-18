import '../polyfills';
import createSender from '../../shared/dist/util/createSender';
import runConfigDialogs from './dialogs';
import './index.sass';

const main = async () => {
  runConfigDialogs();

  const createActionRunner = (await import('./actions')).default;
  const socket = new WebSocket(
    // HOSTNAME & PORT kommen aus webpack.DefinePlugin
    // und wird im Buildprozess gesetzt
    // eslint-disable-next-line no-undef
    `ws://${HOSTNAME}${PORT ? ':' : ''}${PORT}/`,
  );
  const send = createSender(socket);
  const runAction = createActionRunner(send);

  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    runAction(message);
  };
};

main();
