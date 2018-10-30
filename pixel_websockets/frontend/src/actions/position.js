import extractPosition from '../util/extractPosition';

const position = send => () => {
  const { x, y } = extractPosition();
  send({ x, y });
};

export default position;
