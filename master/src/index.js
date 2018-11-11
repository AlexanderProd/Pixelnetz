import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/config';
import App from './App';
import './index.sass';
import { useState } from 'react';
import axios from 'axios';

import getBaseUrl from '../../shared/util/baseUrl';


ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
);


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

const [count, setCount] = useState(null);

const file = document.createElement('input');
file.type = 'file';
file.onchange = this.handleselectedFile();

const upload = document.createElement('button');
upload.innerHTML = 'Upload';
upload.onclick = () => {
  const data = new FormData();
  data.append('file', count.selectedFile, count.selectedFile.name);
  axios.post(`${baseUrl}/upload`, data)
  .then(res => {
    console.log(res.statusText)
  });
};

handleselectedFile = event => {
  setCount({
    selectedFile: event.target.files[0],
    loaded: 0,
  })
};

document.body.appendChild(start);
document.body.appendChild(stop);
document.body.appendChild(upload);
document.body.appendChild(file);
