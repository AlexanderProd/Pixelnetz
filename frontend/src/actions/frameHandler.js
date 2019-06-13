import { createColorEncoder } from '../../../shared/dist/util/colors';
import player from '../audio';

function createFrameHanlder(sequence) {
  const { decode: decodeColor } = createColorEncoder(
    sequence.bitDepth,
  );

  const setColor = encodedColor => {
    const [r, g, b] = decodeColor(encodedColor);
    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    if (r + g + b > (255 * 3) / 2) {
      player.setVolume(1);
    } else {
      player.setVolume(0);
    }
  };

  return setColor;
}

export default createFrameHanlder;