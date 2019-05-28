import NoSleep from 'nosleep.js/dist/NoSleep';
import dialog from './dialog';
import player from '../audio';

const noSleep = new NoSleep();

const description =
  'Für eine bessere Darstellung stellen wir das ' +
  'automatische Abschalten des Displays aus.';

const enableNoSleep = () =>
  dialog({ description }).then(() => {
    noSleep.enable();
    player.play();
  });

export default enableNoSleep;
