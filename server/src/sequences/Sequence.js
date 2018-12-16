import fs from 'fs';
import { promisify } from 'util';
import rasterize from '../sequences/rasterize';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

const DB_PATH = `${__dirname}/../../db`;

class Sequence {
  static fromFile({
    file,
    repeat,
  }) {
    return rasterize(file.data, file.mimetype)
      .then(({ matrix, stepLength }) => new Sequence({
        name: file.name,
        repeat,
        stepLength,
        matrix,
      }));
  }

  static async load(name) {
    const readInfo = readFile(`${DB_PATH}/${name}.json`)
      .then(sequence => JSON.parse(sequence));

    return new Sequence({
      ...(await readInfo),
    });
  }

  static listAvailable() {
    return fs.readdirSync(DB_PATH)
      .map(fileName => fileName.split('.json')[0])
      .filter(fileName => !fileName.match(/\.matrix/));
  }

  constructor({
    name,
    repeat,
    stepLength,
    matrix = null,
  }) {
    this._name = name;
    this._repeat = repeat;
    this._stepLength = stepLength;
    this._matrix = matrix;
  }

  get info() {
    return {
      name: this._name,
      repeat: this._repeat,
      stepLength: this._stepLength,
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

  get matrix() {
    return new Promise((res, rej) => {
      if (this._matrix) {
        res(this._matrix);
      } else {
        readFile(`${DB_PATH}/${this._name}.json`)
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
        JSON.stringify({
          name: this._name,
          repeat: this._repeat,
          stepLength: this._stepLength,
        }),
      ),
    ]);
  }
}

export default Sequence;
