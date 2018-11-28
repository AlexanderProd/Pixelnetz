import '../polyfills';
import baseUrl from '../../shared/util/baseUrl';
import createSender from '../../shared/util/createSender';
import createActionRunner from './actions';
import enableNoSleep from '../src/util/browserModules';
// import openFullscreen from '../src/util/browserModules';

const main = async () => {
  const { hostname } = await (fetch(`${baseUrl()}/wshost`).then(r => r.json()));
  const socket = new WebSocket(`ws://${hostname}:3001`);
  const send = createSender(socket);
  const runAction = createActionRunner(send);

  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    runAction(message);
  };

  console.log('indexFrontend');
  const elem = document.getElementById('toggle');
  elem.addEventListener('click', enableNoSleep, false);
  // openFullscreen(document.getElementById('toggle'));
};

main();
