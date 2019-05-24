import { createColorEncoder } from '../../../shared/dist/util/colors';

function createFrameHanlder(sequence) {
  const { decode: decodeColor } = createColorEncoder(
    sequence.bitDepth,
  );

  const setColor = encodedColor => {
    const [r, g, b] = decodeColor(encodedColor);
    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  };

  return setColor;
}

export default createFrameHanlder;
