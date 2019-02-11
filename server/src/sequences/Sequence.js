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
    return Promise.all(
      fs.readdirSync(DB_PATH)
        .filter(fileName => !fileName.match(/\.matrix/))
        .map((fileName) => {
          const name = fileName.split('.json')[0];
          return Sequence.load(name).then(seq => seq.info);
        }),
    );
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

  loadMatrix() {
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

  getFrames(x, y) {
    const {
      scaleRatio,
      xOffset,
      yOffset,
      gxOffset,
      gyOffset,
    } = this._scaling;

    const mx =
      Math.floor((x - gxOffset) * scaleRatio) + // Scale pixel coordinate
      xOffset + // Center grid to matrix
      Math.floor(scaleRatio / 2); // Center pixel
    const my =
      Math.floor((y - gyOffset) * scaleRatio) +
      yOffset +
      Math.floor(scaleRatio / 2);

    return this._matrix[(this._width * my) + mx];
  }

  getMasterMatrix() {
    const {
      gxOffset,
      gyOffset,
      gWidth,
      gHeight,
    } = this._scaling;

    const matrix = new Array(this._length);

    for (let i = 0; i < this._length; i++) {
      const frame = new Array(gWidth * gHeight);
      matrix[i] = [frame, null];
    }

    for (let y = 0; y < gHeight; y++) {
      for (let x = 0; x < gWidth; x++) {
        const gx = (x + gxOffset);
        const gy = (y + gyOffset);
        const frameStack = this.getFrames(gx, gy);
        frameStack.forEach(([pixelCol, stepLength], i) => {
          const level = matrix[i];
          level[0][(gWidth * y) + x] = pixelCol;
          level[1] = stepLength;
        });
      }
    }

    return matrix;
  }

  scale(dimensions) {
    const width = this._width;
    const height = this._height;
    const gxOffset = dimensions.xOffset;
    const gyOffset = dimensions.yOffset;
    const gWidth = dimensions.width;
    const gHeight = dimensions.height;
    const wScale = width / gWidth;
    const hScale = height / gHeight;
    const aspect = width / height;
    const gAspect = gWidth / gHeight;

    const scaleRatio = aspect < gAspect ? wScale : hScale;
    const xOffset = Math.floor((width - (gWidth * scaleRatio)) / 2);
    const yOffset = Math.floor((height - (gHeight * scaleRatio)) / 2);

    this._scaling = {
      scaleRatio,
      xOffset,
      yOffset,
      gxOffset,
      gyOffset,
      gWidth,
      gHeight,
    };
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
