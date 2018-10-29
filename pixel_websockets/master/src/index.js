import '../../polyfills';
import getBaseUrl from '../../util/baseUrl';

const baseUrl = getBaseUrl();

const start = document.createElement('button');
start.innerHTML = 'start';
start.onclick = () => fetch(`${baseUrl}/start`)
  .then(r => r.json())
  .then(r => console.log(r))
  .catch(err => console.error(err));

const stop = document.createElement('button');
stop.innerHTML = 'stop';
stop.onclick = () => fetch(`${baseUrl}/stop`)
  .then(r => r.json())
  .then(r => console.log(r))
  .catch(err => console.error(err));

document.body.appendChild(start);
document.body.appendChild(stop);
