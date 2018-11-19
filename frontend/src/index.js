import '../polyfills';
import baseUrl from '../../shared/util/baseUrl';
import createSender from '../../shared/util/createSender';
import createActionRunner from './actions';

const main = async () => {
  const { hostname } = await (fetch(`${baseUrl()}/wshost`).then(r => r.json()));
  const socket = new WebSocket(`ws://${hostname}:8888`);
  const send = createSender(socket);
  const runAction = createActionRunner(send);

  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);

    runAction(message);

    console.log(message);
  };
};

main();
