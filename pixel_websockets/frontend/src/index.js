import '../../polyfills';
import baseUrl from '../../util/baseUrl';
import { createSender } from '../../util/createSender';
import getActions from './actions';

const main = async () => {
  const { hostname } = await (fetch(`${baseUrl()}/wshost`).then(r => r.json()));
  const socket = new WebSocket(`ws://${hostname}:8888`);
  const send = createSender(socket);
  const actions = getActions(send);

  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    const { actionType } = message;

    actions[actionType](message);

    console.log(message);
  };
};

main();
