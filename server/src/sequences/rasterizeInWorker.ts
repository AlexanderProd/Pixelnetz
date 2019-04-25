import ThreadProcess from '../threads/ThreadProcess';
import rasterizePart, {
  PartRasterizationInput,
} from './rasterizePart';
import { Matrix } from './rasterization';

const threadProcess = new ThreadProcess<
  PartRasterizationInput,
  Matrix
>(data => rasterizePart(data));
