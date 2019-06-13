import fs from 'fs';
import { promisify } from 'util';
import { AUDIO_DB_PATH } from '../util/dbPath';
import AudioMimetypes, {
  getFileExtension,
} from '../../../shared/src/audio/AudioMimetypes';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);

const SELECTION_PATH = `${AUDIO_DB_PATH}/__selection__.json`;

class AudioDB {
  private selection: Set<string> = new Set();

  constructor() {
    exists(SELECTION_PATH)
      .then(fileExists =>
        fileExists ? readFile(SELECTION_PATH, 'utf-8') : '[]',
      )
      .then(json => JSON.parse(json))
      .then((selection: string[]) => {
        console.log(
          `Audio selection loaded: ${selection.toString()}`,
        );
        this.selection = new Set([...selection, ...this.selection]);
      });

    const exitHandler = () => {
      console.log('Writing audio selection to file...');
      fs.writeFileSync(
        SELECTION_PATH,
        JSON.stringify([...this.selection]),
        'utf-8',
      );
      process.exit();
    };
    // do something when app is closing
    process.on('exit', exitHandler);
    // catches ctrl+c event
    process.on('SIGINT', exitHandler);
    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', exitHandler);
    process.on('SIGUSR2', exitHandler);
    // catches uncaught exceptions
    process.on('uncaughtException', exitHandler);
  }

  async addSelected(name: string): Promise<void> {
    if (await this.exists(name)) {
      this.selection.add(name);
    }
  }

  async removeSelected(name: string): Promise<void> {
    if (await this.exists(name)) {
      this.selection.delete(name);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getPath(name: string): string {
    return `${AUDIO_DB_PATH}/raw/${name}`;
  }

  exists(name: string): Promise<boolean> {
    return exists(this.getPath(name));
  }

  listSelected(): string[] {
    return [...this.selection];
  }

  isSelected(name: string): boolean {
    return this.selection.has(name);
  }

  // eslint-disable-next-line class-methods-use-this
  listAvailable(): Promise<string[]> {
    return readdir(`${AUDIO_DB_PATH}/raw`);
  }

  save(
    name: string,
    mimetype: AudioMimetypes,
    data: Buffer,
  ): Promise<void> {
    return writeFile(
      `${this.getPath(name)}.${getFileExtension(mimetype)}`,
      data,
    );
  }

  delete(name: string): Promise<void> {
    if (this.isSelected(name)) {
      this.removeSelected(name);
    }
    return unlink(this.getPath(name));
  }
}

export default AudioDB;
