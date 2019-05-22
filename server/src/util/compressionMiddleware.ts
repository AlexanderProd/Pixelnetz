import {
  Request,
  Response,
  Application,
  NextFunction,
} from 'express';
import fs from 'fs';
import { promisify } from 'util';

const exists = promisify(fs.exists);

const compressions = [
  {
    encoding: 'br',
    extension: 'br',
  },
  {
    encoding: 'gzip',
    extension: 'gz',
  },
];

const staticPath = `${__dirname}/../../../dist/static`;

const types = [
  {
    extension: '.js',
    contentType: 'text/javascript',
  },
  {
    extension: '.css',
    contentType: 'text/css',
  },
  {
    extension: '.html',
    contentType: 'text/html',
  },
];

const serveCompressed = (contentType: string) => async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const acceptedEncodings = req.acceptsEncodings();

  const urlParts = req.originalUrl.split('/');
  const fileName = urlParts.pop();
  const path = urlParts[1] || 'frontend';

  const foundCompression = (await Promise.all(
    compressions.map(async comp => {
      const hasFile = await exists(
        `${staticPath}/${path}/${fileName}.${comp.extension}`,
      );
      return {
        exists: acceptedEncodings.includes(comp.encoding) && hasFile,
        compression: comp,
      };
    }),
  )).find(comp => comp.exists);

  const compression =
    foundCompression && foundCompression.compression;

  if (compression) {
    req.url = `${req.url}.${compression.extension}`;
    res.set('Content-Encoding', compression.encoding);
    res.set('Content-Type', contentType);
  }

  next();
};

const compressionMiddleware = (app: Application) =>
  types.forEach(({ extension, contentType }) =>
    app.get(`*${extension}`, serveCompressed(contentType)),
  );

export default compressionMiddleware;
