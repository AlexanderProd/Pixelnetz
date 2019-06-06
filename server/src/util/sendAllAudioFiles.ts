import fs from 'fs';
import { promisify } from 'util';
import { ALL_AUDIO_FILES } from '../../../shared/src/util/socketActionTypes';
import Pool from '../ws/Pool';
import Socket from '../ws/Socket';

const readdir = promisify(fs.readdir);

const DB_PATH = `${__dirname}/../../../../audiodb`;

async function sendAllAudioFiles(pool: Pool): Promise<void>;
async function sendAllAudioFiles(socket: Socket): Promise<void>;
async function sendAllAudioFiles(
  poolOrSocket: Pool | Socket,
): Promise<void> {
  try {
    const dir = await readdir(DB_PATH);
    poolOrSocket.send({
      actionType: ALL_AUDIO_FILES,
      data: dir,
    });
  } catch (e) {
    console.error('Failed to send audio files');
  }
}

export default sendAllAudioFiles;
