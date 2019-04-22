import { Stream } from 'stream';
import gifFramesUntyped from './gifFrames';

interface GifFramesReturn {
  getImage: () => Stream;
  frameInfo: {
    delay: number;
  };
  frameIndex: number;
}

type Initializer = string | number | (number | [number, number])[];

const gifFrames: (options: {
  url: string | Buffer;
  frames: 'all' | Initializer;
  outputType: 'png' | 'jpg' | 'jpeg' | 'gif' | 'canvas';
}) => Promise<GifFramesReturn[]> = gifFramesUntyped;

export default gifFrames;
