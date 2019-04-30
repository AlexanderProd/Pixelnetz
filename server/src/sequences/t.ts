import rasterize from './rasterize';
import png from './__testdata__/png';
import Mimetypes from './mimetypes';

(async () => {
  const r = await rasterize(png, Mimetypes.PNG);
  const res = (await r.getMatrixPart().next()).value;
  console.log(res.matrix.length);
  
})();
