import enableNoSleep from './enableNoSleep';
import './dialog.sass';

const runConfigDialogs = async () => {
  const fullscreenConfigImport = import('./fullscreen');

  await enableNoSleep();

  const fullscreenConfig = (await fullscreenConfigImport).default;

  fullscreenConfig();
};

export default runConfigDialogs;

