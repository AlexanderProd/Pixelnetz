import { createColorEncoding } from '../../../shared/dist/util/colors';
import player from '../audio';

function createFrameHandler(sequence) {
  const { decode: decodeColor } = createColorEncoding(
    sequence.bitDepth,
  );

  const withSound = !!sequence.soundFile;

  if (withSound) {
    player.selectSound(sequence.soundFile);
  }

  const setColor = encodedColor => {
    const [r, g, b] = decodeColor(encodedColor);
    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    if (withSound) {
      if (r + g + b > (255 * 3) / 2) {
        player.setVolume(1);
      } else {
        player.setVolume(0);
      }
    }
  };

  return setColor;
}

export default createFrameHandler;
