import { ALL_SEQUENCES } from '../../../shared/dist/util/socketActionTypes';
import Sequence from '../sequences/Sequence';

const sendAllSequences = pool => pool.sendAll({
  actionType: ALL_SEQUENCES,
  data: Sequence.listAvailable(),
});

export default sendAllSequences;
