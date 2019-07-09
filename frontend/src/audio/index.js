import { getAudioMimetype } from '../../../shared/dist/audio/AudioMimetypes';
import BASE_URL from '../util/baseUrl';
import { isIOSSafari } from '../util/userAgent';

function createSinglePlayer(name) {
  const playerTag = document.createElement('audio');
  playerTag.loop = true;
  playerTag.controls = false;
  // IS_DEV kommt aus webpack.DefinePlugin
  // und wird im Buildprozess gesetzt
  // eslint-disable-next-line no-undef
  const urlPrefix = IS_DEV ? `http://${BASE_URL}` : '';
  playerTag.src = `${urlPrefix}/audiofiles/${name}`;
  playerTag.type = getAudioMimetype(name);

  // eslint-disable-next-line no-shadow
  function play() {
    playerTag.play();
  }

  // eslint-disable-next-line no-shadow
  function setVolume(vol) {
    playerTag.volume = vol;
  }

  function getVolume() {
    return playerTag.volume;
  }

  return {
    name,
    play,
    setVolume,
    getVolume,
  };
}

function createPlayer() {
  let players = [];
  let selected = null;

  function setFiles(files) {
    if (isIOSSafari()) return;
    players = files.map(file => createSinglePlayer(file));
    [selected] = players;
  }

  function play() {
    players.forEach(player => {
      player.setVolume(0);
      player.play();
    });
  }

  function selectSound(name) {
    players.forEach(p => p.setVolume(0));
    const player = players.find(p => p.name === name);
    if (player) {
      selected = player;
    }
  }

  function setVolume(vol) {
    if (selected) {
      selected.setVolume(vol);
    }
  }

  const player = {
    play,
    selectSound,
    setVolume,
    setFiles,
  };

  return player;
}

const player = createPlayer();

export default player;
