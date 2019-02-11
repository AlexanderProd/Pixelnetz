import NoSleep from 'nosleep.js';
import dialog from './dialog';

const noSleep = new NoSleep();

const description = 'Für eine bessere Darstellung stellen wir das ' +
  'automatische Abschalten des Displays aus.';

const enableNoSleep = () => dialog({ description }).then(() => noSleep.enable());

export default enableNoSleep;
