import runWelcomeDialog from './runWelcomeDialog';
import './dialog.sass';

const runConfigDialogs = async () => {
  const fullscreenConfigImport = import(
    /* webpackChunkName: 'fullscreen' */ './fullscreen'
  );

  await runWelcomeDialog();

  const fullscreenConfig = (await fullscreenConfigImport).default;
  fullscreenConfig();
};

export default runConfigDialogs;
