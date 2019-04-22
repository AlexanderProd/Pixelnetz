import { promisify } from 'util';
import getPixelsCB from './getPixels';
import Mimetypes from '../../sequences/mimetypes';

export interface PixelData {
  data: number[];
  shape: [number, number, number];
}

const getPixels: (
  buffer: Buffer,
  mimetype: Mimetypes,
) => Promise<PixelData> = promisify(getPixelsCB);

export default getPixels;
