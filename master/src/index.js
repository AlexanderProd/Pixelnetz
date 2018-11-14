import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/config';
import App from './App';
import './index.sass';

import getBaseUrl from '../../shared/util/baseUrl';

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
);


const baseUrl = getBaseUrl();

const file = document.createElement('input');
file.type = 'file';
file.name = 'sampleFile';

let selectedFile = null;

file.oninput = (e) => {
  const { files } = e.target;
  selectedFile = files[0];
};

const upload = document.createElement('input');
upload.type = 'submit';
upload.value = 'upload';

upload.onclick = () => {
  const formData = new FormData();
  formData.append('file', selectedFile, 'sampleFile.png');

  fetch(`${baseUrl}/upload`, {
    method: 'POST',
    'Content-Type': 'image/png',
    body: formData,
  })
    .then(r => r.text())
    .then(r => console.log(r))
    .catch(e => console.log(e));
};

document.body.appendChild(file);
document.body.appendChild(upload);
