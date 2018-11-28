import NoSleep from 'nosleep.js';
import fullscreen from 'fullscreen';

const fs = fullscreen(document.documentElement);
const noSleep = new NoSleep();

const configureBrowser = () => {
  noSleep.enable();

  const enableButton = document.createElement('input');
  enableButton.type = 'button';
  enableButton.value = 'Please put your brightness to max and click here!';

  const disableButton = document.createElement('input');
  disableButton.type = 'button';
  disableButton.value = 'exit';
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

  document.body.appendChild(enableButton);
  document.body.appendChild(disableButton);
};

export default configureBrowser;

