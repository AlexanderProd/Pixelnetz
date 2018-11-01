import '../../polyfills';
import getBaseUrl from '../../util/baseUrl';

let token = null;

const baseUrl = getBaseUrl();

const usernameInput = document.createElement('input');
usernameInput.placeholder = 'Username';
usernameInput.name = 'username';

const passwordInput = document.createElement('input');
passwordInput.placeholder = 'Password';
passwordInput.name = 'password';
passwordInput.type = 'password';

const loginButton = document.createElement('input');
loginButton.value = 'Login';
loginButton.type = 'submit';

const loginForm = document.createElement('form');
loginForm.onsubmit = (e) => {
  e.preventDefault();
  fetch(`${baseUrl}/authenticate`, {
    method: 'POST',
    body: JSON.stringify({
      username: usernameInput.value,
      password: passwordInput.value,
    }),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(r => r.json())
    .then((r) => {
      ({ token } = r);
      console.log(r);
    })
    .catch(err => console.error(err));
};

loginForm.appendChild(usernameInput);
loginForm.appendChild(passwordInput);
loginForm.appendChild(document.createElement('br'));
loginForm.appendChild(loginButton);
document.body.appendChild(loginForm);
document.body.appendChild(document.createElement('br'));

const start = document.createElement('button');
start.innerHTML = 'start';
start.onclick = () => fetch(`${baseUrl}/start`, { headers: { 'x-access-token': token } })
  .then(r => r.text())
  .then(r => console.log(r))
  .catch(err => console.error(err));

const stop = document.createElement('button');
stop.innerHTML = 'stop';
stop.onclick = () => fetch(`${baseUrl}/stop`, { headers: { 'x-access-token': token } })
  .then(r => r.text())
  .then(r => console.log(r))
  .catch(err => console.error(err));

document.body.appendChild(start);
document.body.appendChild(stop);
