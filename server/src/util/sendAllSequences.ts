import { ALL_SEQUENCES } from '../../../shared/src/util/socketActionTypes';
import Sequence from '../sequences/Sequence';
import Pool from '../ws/Pool';

async function sendAllSequences(pool: Pool) {
  try {
    const sequences = await Sequence.listAvailable();
    pool.sendAll({
      actionType: ALL_SEQUENCES,
      data: sequences,
    });
  } catch (e) {
    console.error('Failed to send sequence info to master');
  }
}

export default sendAllSequences;
