import screenBrightness from './screenBrightness';
import './dialog.sass';

const runConfigDialogs = async () => {
  const enableNoSleepImport = import(
    /* webpackChunkName: 'enableNoSleep' */ './enableNoSleep'
  );
  const fullscreenConfigImport = import(
    /* webpackChunkName: 'fullscreen' */ './fullscreen'
  );

  await screenBrightness();

  const enableNoSleep = (await enableNoSleepImport).default;
  await enableNoSleep();

  const fullscreenConfig = (await fullscreenConfigImport).default;
  fullscreenConfig();
};

export default runConfigDialogs;
