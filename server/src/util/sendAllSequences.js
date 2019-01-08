import { ALL_SEQUENCES } from '../../../shared/dist/util/socketActionTypes';
import Sequence from '../sequences/Sequence';

const sendAllSequences = async (pool) => {
  try {
    const sequences = await Sequence.listAvailable();
    pool.sendAll({
      actionType: ALL_SEQUENCES,
      data: sequences,
    });
  } catch (e) {
    console.error('Failed to send sequence info to master');
  }
};

export default sendAllSequences;
