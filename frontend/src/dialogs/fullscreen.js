import fullscreen from 'fullscreen';
import { isIOSSafari } from '../util/userAgent';

const fs = fullscreen(document.documentElement);

const fullscreenConfig = () => {
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

  if (!isIOSSafari()) {
    document.body.appendChild(enableButton);
    document.body.appendChild(disableButton);
  }
};

export default fullscreenConfig;
