import fs from 'fs';

const compressions = [{
  encoding: 'br',
  extension: 'br',
}, {
  encoding: 'gzip',
  extension: 'gz',
}];

const staticPath = `${__dirname}/../../../dist/static`;

const types = [{
  extension: '.js',
  contentType: 'text/javascript',
}, {
  extension: '.css',
  contentType: 'text/css',
}, {
  extension: '.html',
  contentType: 'text/html',
}];

const serveCompressed = (contentType) => (req, res, next) => {
  const acceptedEncodings = req.acceptsEncodings();

  const urlParts = req.originalUrl.split('/');
  const fileName = urlParts.pop();
  const path = urlParts[1] || 'frontend';

  const compression = compressions.find(comp => (
    acceptedEncodings.indexOf(comp.encoding) !== -1 &&
    fs.existsSync(`${staticPath}/${path}/${fileName}.${comp.extension}`)
  ));

  if (compression) {
    req.url = `${req.url}.${compression.extension}`;
    res.set('Content-Encoding', compression.encoding);
    res.set('Content-Type', contentType);
  }

  next();
};

const compressionMiddleware = (app) => types.forEach(({
  extension,
  contentType,
}) => app.get(`*${extension}`, serveCompressed(contentType)));

export default compressionMiddleware;
