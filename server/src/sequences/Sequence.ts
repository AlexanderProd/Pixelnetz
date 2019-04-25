import fs from 'fs';
import { promisify } from 'util';
import rasterize, { Matrix, Frame } from './rasterize';
import Mimetypes from './mimetypes';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

const DB_PATH = `${__dirname}/../../../../db`;

interface FileInput {
  file: {
    data: Buffer;
    mimetype: string;
    name: string;
  };
  repeat: boolean;
}

interface Dimensions {
  xOffset: number;
  yOffset: number;
  width: number;
  height: number;
}

interface Scaling {
  scaleRatio: number;
  xOffset: number;
  yOffset: number;
  gxOffset: number;
  gyOffset: number;
  gWidth: number;
  gHeight: number;
}

class Sequence {
  static async fromFile({ file, repeat }: FileInput): Promise<void> {
    const mimetype = file.mimetype as Mimetypes;
    const { getMatrixPart, ...data } = await rasterize(
      file.data,
      mimetype,
    );
    const seq = new Sequence({
      name: file.name,
      repeat,
      ...data,
    });
    await writeFile(
      `${DB_PATH}/${seq.name}.json`,
      JSON.stringify(seq.info),
    );
    for await (const { matrix, index } of getMatrixPart()) {
      // eslint-disable-next-line no-await-in-loop
      await writeFile(
        `${DB_PATH}/${seq.name}.matrix.${index}.json`,
        JSON.stringify(matrix),
      );
    }
  }

  static async load(name: string) {
    const info = await readFile(
      `${DB_PATH}/${name}.json`,
      'utf-8',
    ).then(sequence => JSON.parse(sequence));
    return new Sequence(info);
  }

  static listAvailable() {
    return Promise.all(
      fs
        .readdirSync(DB_PATH)
        .filter(fileName => !fileName.match(/\.matrix/))
        .map(fileName => {
          const name = fileName.split('.json')[0];
          return Sequence.load(name).then(seq => seq.info);
        }),
    );
  }

  static async exists(name: string) {
    return !!(await Sequence.listAvailable()).find(
      seq => seq.name === name,
    );
  }

  static delete(name: string) {
    return Promise.all([
      unlink(`${DB_PATH}/${name}.matrix.json`),
      unlink(`${DB_PATH}/${name}.json`),
    ]);
  }

  private _name: string;

  private _repeat: boolean;

  private _stepLength: number;

  private _width: number;

  private _height: number;

  private _length: number;

  private _duration: number;

  private _numParts: number;

  private _matrix: Matrix | undefined;

  private _scaling: Scaling | undefined;

  constructor({
    name,
    repeat,
    stepLength,
    width,
    height,
    length,
    duration,
    numParts,
    matrix = undefined,
  }: {
    name: string;
    repeat: boolean;
    stepLength: number;
    width: number;
    height: number;
    length: number;
    duration: number;
    numParts: number;
    matrix?: Matrix;
  }) {
    this._name = name;
    this._repeat = repeat;
    this._stepLength = stepLength;
    this._width = width;
    this._height = height;
    this._length = length;
    this._duration = duration;
    this._matrix = matrix;
    this._numParts = numParts;
    this._scaling = undefined;
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
      numParts: this._numParts,
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

  get numParts() {
    return this._numParts;
  }

  __loadMatrix(): Promise<Matrix> {
    return new Promise((res, rej) => {
      if (this._matrix) {
        res(this._matrix);
      } else {
        readFile(`${DB_PATH}/${this._name}.matrix.json`, 'utf-8')
          .then(sequenceJSON => {
            const sequence = JSON.parse(sequenceJSON);
            this._matrix = sequence;
            res(sequence);
          })
          .catch(rej);
      }
    });
  }

  async loadMatrix(index: number): Promise<Matrix> {
    const matrixJSON = await readFile(
      `${DB_PATH}/${this._name}.matrix.${index}.json`,
      'utf-8',
    );
    const matrix = JSON.parse(matrixJSON) as Matrix;
    return matrix;
  }

  async *loadMatrices(): AsyncIterableIterator<Matrix> {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this._numParts; i++) {
      this._matrix = undefined;
      // eslint-disable-next-line no-await-in-loop
      this._matrix = await this.loadMatrix(i);
      yield this._matrix;
    }
  }

  getFrames(x: number, y: number): Frame[] {
    if (!this._scaling) {
      throw new ReferenceError(
        'Scaling has not been set on Sequence',
      );
    }
    if (!this._matrix) {
      throw new ReferenceError(
        'Matrix has not been loaded on Sequence',
      );
    }

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

    return this._matrix[this._width * my + mx];
  }

  getMasterMatrix(): Matrix {
    if (!this._scaling) {
      throw new ReferenceError(
        'Scaling has not been set on Sequence',
      );
    }

    const { gxOffset, gyOffset, gWidth, gHeight } = this._scaling;

    const matrix = new Array(this._length);

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this._length; i++) {
      const frame = new Array(gWidth * gHeight);
      matrix[i] = [frame, null];
    }

    // eslint-disable-next-line no-plusplus
    for (let y = 0; y < gHeight; y++) {
      // eslint-disable-next-line no-plusplus
      for (let x = 0; x < gWidth; x++) {
        const gx = x + gxOffset;
        const gy = y + gyOffset;
        const frameStack = this.getFrames(gx, gy);
        frameStack.forEach(([pixelCol, stepLength], i) => {
          const level = matrix[i];
          level[0][gWidth * y + x] = pixelCol;
          level[1] = stepLength;
        });
      }
    }

    return matrix;
  }

  scale(dimensions: Dimensions) {
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
    const xOffset = Math.floor((width - gWidth * scaleRatio) / 2);
    const yOffset = Math.floor((height - gHeight * scaleRatio) / 2);

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