import screenBrightness from './screenBrightness';
import './dialog.sass';

const runConfigDialogs = () => {
  const enableNoSleepImport = import('./enableNoSleep');
  const fullscreenConfigImport = import('./fullscreen');

  screenBrightness(async () => {
    const enableNoSleep = (await enableNoSleepImport).default;

    enableNoSleep(async () => {
      const fullscreenConfig = (await fullscreenConfigImport).default;
      fullscreenConfig();
    });
  });
};

export default runConfigDialogs;

