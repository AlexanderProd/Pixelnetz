import screenBrightness from './screenBrightness';
import './dialog.sass';

const runConfigDialogs = () => {
  const enableNoSleepImport = import('./enableNoSleep');

  screenBrightness(async () => {
    const enableNoSleep = (await enableNoSleepImport).default;

    enableNoSleep();
  });
};

export default runConfigDialogs;

