import dialog from './dialog';

const description = 'Herzlich willkommen im Pixelnetz!\n' +
  'Bitte stelle deine Bildschirmhelligkeit hoch ein.';

const screenBrightness = cb => dialog({
  description,
  onSubmit: cb,
});

export default screenBrightness;
