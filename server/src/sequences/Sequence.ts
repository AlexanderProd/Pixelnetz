import fs from 'fs';
import { promisify } from 'util';
import rasterize from './rasterize';
import {
  MasterMatrix,
  ClientFrame,
  ClientMatrix,
} from './rasterization';
import Mimetypes from './mimetypes';
import { GridDimensions } from '../ws/ClientPool';
import rusterize from './rusterize';

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
  bitDepth: number;
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
  static async fromFile({
    file,
    repeat,
    bitDepth,
  }: FileInput): Promise<void> {
    if (process.env.RASTERIZER !== 'RUSTERIZER') {
      console.log('Using built in rasterzier!');
      return Sequence.fromFileTS({ file, repeat, bitDepth });
    }
    console.log('Using external rusterizer!');
    const mimetype = file.mimetype as Mimetypes;
    const { matrices, ...data } = await rusterize(
      file.data,
      mimetype,
      bitDepth,
    );
    const seq = new Sequence({
      name: file.name,
      repeat,
      ...data,
    });
    await writeFile(
      Sequence.getPath(seq.name),
      JSON.stringify(seq.info),
    );
    return Promise.all(
      matrices.map((matrix, index) =>
        writeFile(Sequence.getMatrixPath(seq.name, index), matrix),
      ),
    ).then();
  }

  static async fromFileTS({
    file,
    repeat,
    bitDepth,
  }: FileInput): Promise<void> {
    const mimetype = file.mimetype as Mimetypes;
    const { getMatrixPart, ...data } = await rasterize(
      file.data,
      mimetype,
      bitDepth,
    );
    const seq = new Sequence({
      name: file.name,
      repeat,
      bitDepth,
      ...data,
    });
    await writeFile(
      Sequence.getPath(seq.name),
      JSON.stringify(seq.info),
    );
    for await (const { matrix, index } of getMatrixPart()) {
      // eslint-disable-next-line no-await-in-loop
      await writeFile(
        Sequence.getMatrixPath(seq.name, index),
        JSON.stringify(matrix),
      );
    }
  }

  static async load(name: string) {
    const info = await readFile(Sequence.getPath(name), 'utf-8').then(
      sequence => JSON.parse(sequence),
    );
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

  static getPath(name: string) {
    return `${DB_PATH}/${name}.json`;
  }

  static getMatrixPath(name: string, index: number) {
    return `${DB_PATH}/${name}.matrix.${index}.json`;
  }

  static async delete(name: string): Promise<void[]> {
    const seq = await Sequence.load(name);
    return seq.delete();
  }

  private _name: string;

  private _repeat: boolean;

  private _stepLength: number;

  private _width: number;

  private _height: number;

  private _length: number;

  private _duration: number;

  private _numChunks: number;

  private _maxChunkSize: number;

  private _bitDepth: number;

  private _matrix: ClientMatrix | undefined;

  private _scaling: Scaling | undefined;

  constructor({
    name,
    repeat,
    stepLength,
    width,
    height,
    length,
    duration,
    numChunks,
    maxChunkSize,
    bitDepth,
    matrix = undefined,
  }: {
    name: string;
    repeat: boolean;
    stepLength: number;
    width: number;
    height: number;
    length: number;
    duration: number;
    numChunks: number;
    maxChunkSize: number;
    bitDepth: number;
    matrix?: ClientMatrix;
  }) {
    this._name = name;
    this._repeat = repeat;
    this._stepLength = stepLength;
    this._width = width;
    this._height = height;
    this._length = length;
    this._duration = duration;
    this._matrix = matrix;
    this._numChunks = numChunks;
    this._maxChunkSize = maxChunkSize;
    this._bitDepth = bitDepth;
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
      numChunks: this._numChunks,
      bitDepth: this._bitDepth,
      maxChunkSize: this._maxChunkSize,
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

  get numChunks() {
    return this._numChunks;
  }

  get bitDepth() {
    return this._bitDepth;
  }

  get maxChunkSize() {
    return this._maxChunkSize;
  }

  async loadMatrix(index: number): Promise<ClientMatrix> {
    const matrixJSON = await readFile(
      Sequence.getMatrixPath(this._name, index),
      'utf-8',
    );
    const matrix = JSON.parse(matrixJSON) as ClientMatrix;
    return matrix;
  }

  async *loadMatrices(): AsyncIterableIterator<{
    matrix: ClientMatrix;
    index: number;
  }> {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this._numChunks; i++) {
      this._matrix = undefined;
      // eslint-disable-next-line no-await-in-loop
      this._matrix = await this.loadMatrix(i);
      yield { matrix: this._matrix, index: i };
    }
  }

  getFrames(x: number, y: number): ClientFrame[] {
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

  getMasterMatrix(index: number): MasterMatrix {
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

    const { gxOffset, gyOffset, gWidth, gHeight } = this._scaling;

    const length = Math.min(
      this._maxChunkSize,
      this._length - index * this._maxChunkSize,
    );

    const matrix: MasterMatrix = new Array(length);

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < length; i++) {
      const frame: (string | number)[] = [];
      matrix[i] = [frame, 1];
    }

    const currentGrid: (string | null)[] = new Array(
      gWidth * gHeight,
    ).fill(null);

    // eslint-disable-next-line no-plusplus
    for (let y = 0; y < gHeight; y++) {
      // eslint-disable-next-line no-plusplus
      for (let x = 0; x < gWidth; x++) {
        const gx = x + gxOffset;
        const gy = y + gyOffset;
        const frameStack = this.getFrames(gx, gy);

        let i = 0;
        for (const [pixelCol, stepLength] of frameStack) {
          // eslint-disable-next-line no-plusplus
          for (let step = 0; step < stepLength; step++) {
            const frame = matrix[i + step][0];
            const prevIndex = frame.length - 1;
            const gridIndex = gWidth * y + x;
            if (pixelCol === currentGrid[gridIndex]) {
              if (typeof frame[prevIndex] === 'number') {
                (frame[prevIndex] as number) += 1;
              } else {
                frame.push(1);
              }
            } else {
              currentGrid[gridIndex] = pixelCol;
              frame.push(pixelCol);
            }
          }
          i += stepLength;
        }
      }
    }

    return matrix;
  }

  scale(dimensions: GridDimensions) {
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
    const xOffset = Math.floor(
      (width - Math.round(gWidth * scaleRatio)) / 2,
    );
    const yOffset = Math.floor(
      (height - Math.round(gHeight * scaleRatio)) / 2,
    );

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

  delete(): Promise<void[]> {
    const matricies = [...new Array(this._numChunks)].map((x, i) =>
      unlink(Sequence.getMatrixPath(this._name, i)),
    );
    return Promise.all([
      ...matricies,
      unlink(Sequence.getPath(this._name)),
    ]);
  }
}

export default Sequence;
