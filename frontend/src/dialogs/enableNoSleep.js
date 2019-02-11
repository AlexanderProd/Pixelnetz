import NoSleep from 'nosleep.js';
import dialog from './dialog';

const noSleep = new NoSleep();

const description = `
Willkommen im Pixelnetz!
Bitte stelle deine Bildschirmhelligkeit hoch ein.
`;

const enableNoSleep = () => dialog({ description }).then(() => noSleep.enable());

export default enableNoSleep;
