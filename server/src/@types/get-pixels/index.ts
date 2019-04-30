import { promisify } from 'util';
import getPixelsCB from './getPixels';
import Mimetypes from '../../sequences/mimetypes';
import PixelData from './PixelData';

const getPixels: (
  buffer: Buffer,
  mimetype: Mimetypes,
) => Promise<PixelData> = promisify(getPixelsCB);

export default getPixels;
