import { POSITION } from '../../../shared/util/socketActionTypes';
import extractPosition from '../util/extractPosition';

const position = send => () => {
  const { x, y } = extractPosition();
  send({
    actionType: POSITION,
    x,
    y,
  });
};

export default position;
