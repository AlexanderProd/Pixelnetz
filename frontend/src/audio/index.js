import audioFiles from './files';

function createSinglePlayer({ src, type, name }) {
  const playerTag = document.createElement('audio');
  playerTag.loop = true;
  playerTag.controls = false;
  playerTag.src = src;
  playerTag.type = type;

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

function createPlayer(files) {
  const players = files.map(file => createSinglePlayer(file));
  let selected = players[0];

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
    selected.setVolume(vol);
  }

  const player = {
    play,
    selectSound,
    setVolume,
  };

  return player;
}

export default createPlayer(audioFiles);
