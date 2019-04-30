import ThreadProcess from '../threads/ThreadProcess';
import rasterizePart, {
  PartRasterizationInput,
} from './rasterizePart';
import { Matrix } from './rasterization';

const t = new ThreadProcess<
  { input: PartRasterizationInput; index: number },
  {
    matrix: Matrix;
    index: number;
  }
>(({ input, index }) =>
  rasterizePart(input).then(matrix => ({ matrix, index })),
);
