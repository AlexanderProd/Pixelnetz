import { ALL_SEQUENCES } from '../../../shared/src/util/socketActionTypes';
import Sequence from '../sequences/Sequence';
import Pool from '../ws/Pool';
import Socket from '../ws/Socket';

async function sendAllSequences(pool: Pool): Promise<void>;
async function sendAllSequences(socket: Socket): Promise<void>;
async function sendAllSequences(
  poolOrSocket: Pool | Socket,
): Promise<void> {
  try {
    const sequences = await Sequence.listAvailable();
    poolOrSocket.send({
      actionType: ALL_SEQUENCES,
      data: sequences,
    });
  } catch (e) {
    console.error('Failed to send sequence info to master');
  }
}

export default sendAllSequences;
