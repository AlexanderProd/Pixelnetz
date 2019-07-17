import { getAudioMimetype } from '../../../shared/dist/audio/AudioMimetypes';
import BASE_URL from '../util/baseUrl';

const AudioContext = window.AudioContext || window.webkitAudioContext;

function createSinglePlayer(name) {
  const audioTag = document.createElement('audio');
  audioTag.loop = true;
  // IS_DEV kommt aus webpack.DefinePlugin
  // und wird im Buildprozess gesetzt
  // eslint-disable-next-line no-undef
  const urlPrefix = IS_DEV ? `http://${BASE_URL}` : '';
  audioTag.src = `${urlPrefix}/audiofiles/${name}`;
  audioTag.type = getAudioMimetype(name);

  const audioContext = new AudioContext();
  const gainNode = audioContext.createGain();
  const track = audioContext.createMediaElementSource(audioTag);
  track.connect(gainNode);
  gainNode.connect(audioContext.destination);

  function play() {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    audioTag.play();
  }

  function setVolume(vol) {
    gainNode.gain.value = vol;
  }

  function getVolume() {
    return gainNode.gain.value;
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
    players = files.map(createSinglePlayer);
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
