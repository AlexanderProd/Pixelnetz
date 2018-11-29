import NoSleep from 'nosleep.js';

const noSleep = new NoSleep();

const enableNoSleep = () => new Promise((resolve) => {
  const description = document.createElement('p');
  description.classList.add('description');
  description.innerHTML = 'Für eine bessere Darstellung stellen wir das automatische ' +
    'Abschalten des Displays aus.';

  const button = document.createElement('button');
  button.innerHTML = 'OK';
  button.type = 'submit';

  const form = document.createElement('form');
  form.classList.add('dialog');
  form.onsubmit = (e) => {
    e.preventDefault();
    noSleep.enable();
    document.body.removeChild(form);
    resolve();
  };

  const container = document.createElement('div');
  container.classList.add('container');

  form.appendChild(description);
  form.appendChild(button);
  container.appendChild(form);
  document.body.appendChild(container);
});

export default enableNoSleep;
