import fullscreen from 'fullscreen';
import screenBrightness from './screenBrightness';
import enableNoSleep from './enableNoSleep';
import './dialog.sass';

const fs = fullscreen(document.documentElement);

const runConfigDialogs = async () => {
  await screenBrightness();
  await enableNoSleep();

  const enableButton = document.createElement('button');
  enableButton.classList.add('basic');
  enableButton.classList.add('fullscreen-button');
  enableButton.innerHTML = 'Vollbild';

  const disableButton = document.createElement('button');
  disableButton.classList.add('basic');
  disableButton.classList.add('fullscreen-button');
  disableButton.innerHTML = 'Vollbild verlassen';
  disableButton.style.display = 'none';

  enableButton.onclick = () => {
    fs.request();
  };

  disableButton.onclick = () => {
    fs.release();
  };

  fs.on('attain', () => {
    enableButton.style.display = 'none';
    disableButton.style.display = 'inline';
  });

  fs.on('release', () => {
    disableButton.style.display = 'none';
    enableButton.style.display = 'inline';
  });

  if (!(/iPhone|iPad|iPod/i.test(navigator.userAgent))) {
    document.body.appendChild(enableButton);
    document.body.appendChild(disableButton);
  }
};

export default runConfigDialogs;

