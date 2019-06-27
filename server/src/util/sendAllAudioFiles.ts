import { ALL_AUDIO_FILES } from '../../../shared/src/util/socketActionTypes';
import Pool from '../ws/Pool';
import Socket from '../ws/Socket';
import AudioDB from '../audio/AudioDB';

async function sendAllAudioFiles(
  pool: Pool,
  audioDB: AudioDB,
): Promise<void>;
async function sendAllAudioFiles(
  socket: Socket,
  audioDB: AudioDB,
): Promise<void>;
async function sendAllAudioFiles(
  poolOrSocket: Pool | Socket,
  audioDB: AudioDB,
): Promise<void> {
  try {
    const files = await audioDB.listAll();
    poolOrSocket.send({
      actionType: ALL_AUDIO_FILES,
      data: files,
    });
  } catch (e) {
    console.error('Failed to send audio files');
  }
}

export default sendAllAudioFiles;
