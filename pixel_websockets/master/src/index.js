import '../../polyfills';

const start = document.createElement('button');
start.innerHTML = 'start';
start.onclick = () => fetch('/start')
  .then(r => r.json())
  .then(r => console.log(r))
  .catch(err => console.error(err));

const stop = document.createElement('button');
stop.innerHTML = 'stop';
stop.onclick = () => fetch('/stop')
  .then(r => r.json())
  .then(r => console.log(r))
  .catch(err => console.error(err));

document.body.appendChild(start);
document.body.appendChild(stop);
