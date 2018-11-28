import NoSleep from 'nosleep.js';

const noSleep = new NoSleep();

const enableNoSleep = () => {
  console.log('enableNoSleep');
  noSleep.enable();
  document.removeEventListener('click', enableNoSleep, false);
  document.getElementById('toggle').style.display = ('none');
};

// const elem = document.getElementById('toggle');


export default enableNoSleep; // openFullscreen;

