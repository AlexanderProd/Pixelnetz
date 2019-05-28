import audioFiles from './files';

const playerTag = document.createElement('audio');
playerTag.loop = true;
playerTag.controls = false;

if (Math.random() < 0.2) {
  playerTag.src = audioFiles.chewi.src;
  playerTag.type = audioFiles.chewi.type;
} else {
  playerTag.src = audioFiles.birds.src;
  playerTag.type = audioFiles.birds.type;
}

function play() {
  playerTag.play();
}

function setVolume(vol) {
  playerTag.volume = vol;
}

function getVolume() {
  return playerTag.volume;
}

setVolume(0);

window.setVolume = setVolume;

const player = {
  play,
  setVolume,
  getVolume,
};

export default player;
