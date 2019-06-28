import player from '../audio';

const loadAudioFiles = () => ({ fileNames }) =>
  player.setFiles(fileNames);

export default loadAudioFiles;
