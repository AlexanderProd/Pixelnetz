import ThreadProcess from '../threads/ThreadProcess';
import rasterizePart, {
  PartRasterizationInput,
} from './rasterizePart';
import { ClientMatrix } from './rasterization';

const t = new ThreadProcess<
  { input: PartRasterizationInput; index: number },
  {
    matrix: ClientMatrix;
    index: number;
  }
>(({ input, index }) =>
  rasterizePart(input).then(matrix => ({ matrix, index })),
);
