import fs from 'fs';
import { promisify } from 'util';
import rasterize from '../sequences/rasterize';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

const DB_PATH = `${__dirname}/../../db`;

class Sequence {
  static fromFile({
    file,
    repeat,
  }) {
    return rasterize(file.data, file.mimetype)
      .then((properties) => new Sequence({
        name: file.name,
        repeat,
        ...properties,
      }));
  }

  static async load(name) {
    const info = await readFile(`${DB_PATH}/${name}.json`)
      .then(sequence => JSON.parse(sequence));
    return new Sequence(info);
  }

  static listAvailable() {
    return fs.readdirSync(DB_PATH)
      .map(fileName => fileName.split('.json')[0])
      .filter(fileName => !fileName.match(/\.matrix/));
  }

  static delete(name) {
    return Promise.all([
      unlink(`${DB_PATH}/${name}.matrix.json`),
      unlink(`${DB_PATH}/${name}.json`),
    ]);
  }

  constructor({
    name,
    repeat,
    stepLength,
    width,
    height,
    length,
    duration,
    matrix = null,
  }) {
    this._name = name;
    this._repeat = repeat;
    this._stepLength = stepLength;
    this._width = width;
    this._height = height;
    this._length = length;
    this._duration = duration;
    this._matrix = matrix;
  }

  get info() {
    return {
      name: this._name,
      repeat: this._repeat,
      stepLength: this._stepLength,
      width: this._width,
      height: this._height,
      length: this._length,
      duration: this._duration,
    };
  }

  get name() {
    return this._name;
  }

  get repeat() {
    return this._repeat;
  }

  get stepLength() {
    return this._stepLength;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get length() {
    return this._length;
  }

  get duration() {
    return this._duration;
  }

  get matrix() {
    return new Promise((res, rej) => {
      if (this._matrix) {
        res(this._matrix);
      } else {
        readFile(`${DB_PATH}/${this._name}.matrix.json`)
          .then(sequenceJSON => {
            const sequence = JSON.parse(sequenceJSON);
            this._matrix = sequence;
            res(sequence);
          })
          .catch(rej);
      }
    });
  }

  save() {
    return Promise.all([
      writeFile(
        `${DB_PATH}/${this._name}.matrix.json`,
        JSON.stringify(this._matrix),
      ),
      writeFile(
        `${DB_PATH}/${this._name}.json`,
        JSON.stringify(this.info),
      ),
    ]);
  }

  delete() {
    return Promise.all([
      unlink(`${DB_PATH}/${this._name}.matrix.json`),
      unlink(`${DB_PATH}/${this._name}.json`),
    ]);
  }
}

export default Sequence;
