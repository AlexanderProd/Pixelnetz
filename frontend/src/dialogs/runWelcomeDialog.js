import NoSleep from 'nosleep.js/dist/NoSleep';
import dialog from './dialog';
import player from '../audio';

const noSleep = new NoSleep();

const description =
  'Herzlich willkommen im Pixelnetz!\n' +
  'Bitte stelle deine Bildschirmhelligkeit ' +
  'und Handylautstärke hoch ein.';

const runWelcomeDialog = () =>
  dialog({ description }).then(() => {
    noSleep.enable();
    player.play();
  });

export default runWelcomeDialog;
