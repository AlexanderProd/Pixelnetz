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

export interface AudioFile {
  fileName: string;
  name: string;
  isSelected: boolean;
}

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

  async setSelected(name: string, value: boolean): Promise<void> {
    return value ? this.addSelected(name) : this.removeSelected(name);
  }

  async addSelected(name: string): Promise<void> {
    const fileName = await this.findFile(name);
    if (fileName) {
      this.selection.add(fileName);
    }
  }

  async removeSelected(name: string): Promise<void> {
    const fileName = await this.findFile(name);
    if (fileName) {
      this.selection.delete(fileName);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getRawPath(): string {
    return `${AUDIO_DB_PATH}/raw`;
  }

  getPath(name: string): string {
    return `${this.getRawPath()}/${name}`;
  }

  // eslint-disable-next-line class-methods-use-this
  extractName(fileName: string): string {
    const nameParts = fileName.split('.');
    nameParts.pop();
    return nameParts.join('_');
  }

  findFile(name: string): Promise<string | undefined> {
    return readdir(this.getRawPath()).then(list =>
      list.find(fileName => this.extractName(fileName) === name),
    );
  }

  exists(name: string): Promise<boolean> {
    return this.findFile(name).then(res => !!res);
  }

  listSelected(): string[] {
    return [...this.selection];
  }

  isSelected(fileName: string): boolean {
    return this.selection.has(fileName);
  }

  // eslint-disable-next-line class-methods-use-this
  listAvailable(): Promise<string[]> {
    return readdir(`${AUDIO_DB_PATH}/raw`);
  }

  async listAll(): Promise<AudioFile[]> {
    const fileNames = await this.listAvailable();
    return fileNames.map(fileName => ({
      fileName,
      name: this.extractName(fileName),
      isSelected: this.isSelected(fileName),
    }));
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

  async delete(name: string): Promise<void> {
    const fileName = await this.findFile(name);
    if (!fileName) {
      return Promise.reject(
        new Error(`File "${name}" does not exist`),
      );
    }
    if (this.isSelected(name)) {
      this.removeSelected(name);
    }
    return unlink(this.getPath(fileName));
  }
}

export default AudioDB;
