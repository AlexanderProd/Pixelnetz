import fetch from 'node-fetch';
import fs from 'fs';
import png from './large_jpeg';

// const fd = new FormData();
// fd.append('data', png);

const gif = fs.readFileSync(
  `${__dirname}/../../../test_images/mothman.gif`,
);
const start = Date.now();
fetch(
  'http://localhost:8000/rasterize?format=gif&bit_depth=8&max_width=100',
  {
    method: 'POST',
    body: gif,
  },
)
  .then(r => r.text())
  .then(r => {
    // fs.writeFileSync(`${__dirname}/y.matrix.0.json`, r, 'utf-8');
    console.log(r.length);
    console.log(`\n\n>> ${Date.now() - start}`);
  });
