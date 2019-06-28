import { createColorEncoding } from '../../../shared/dist/util/colors';
import player from '../audio';

function createFrameHandler(sequence) {
  const { decode: decodeColor } = createColorEncoding(
    sequence.bitDepth,
  );

  const withSound = !!sequence.soundFile;
  const [rMin, gMin, bMin] = (sequence.soundCondition || '')
    .split(';')
    .filter(str => !!str)
    .map(str => str.trim())
    .map(Number)
    .map(ratio => 255 * ratio)
    .map(Math.floor);

  if (withSound) {
    player.selectSound(sequence.soundFile);
  }

  const setColor = encodedColor => {
    const [r, g, b] = decodeColor(encodedColor);
    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    if (withSound) {
      if (r >= rMin && g >= gMin && b >= bMin) {
        player.setVolume(1);
      } else {
        player.setVolume(0);
      }
    }
  };

  return setColor;
}

export default createFrameHandler;
