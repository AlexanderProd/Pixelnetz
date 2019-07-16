import { PONG } from '../../../shared/dist/util/socketActionTypes';

const pong = send => () => send({ actionType: PONG });

export default pong;
