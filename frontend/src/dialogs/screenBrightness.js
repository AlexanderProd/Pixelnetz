import dialog from './dialog';

const description =
  'Herzlich willkommen im Pixelnetz!\n' +
  'Bitte stelle deine Bildschirmhelligkeit hoch ein.';

const screenBrightness = () => dialog({ description });

export default screenBrightness;
