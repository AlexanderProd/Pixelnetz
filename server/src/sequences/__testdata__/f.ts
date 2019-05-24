import fetch from 'node-fetch';
import fs from 'fs';
import png from './large_jpeg';

// const fd = new FormData();
// fd.append('data', png);

const gif = fs.readFileSync(
  `${__dirname}/../../../test_images/g.gif`,
);
const start = Date.now();
fetch(
  'http://localhost:8000/rasterize?format=gif&bit_depth=8&max_width=100',
  {
    method: 'POST',
    body: gif,
  },
)
  .then(r => r.json())
  .then(({ matrices, ...data }) => {
    // fs.writeFileSync(`${__dirname}/y.matrix.0.json`, r, 'utf-8');
    console.log(`${matrices[0].substring(0, 300)}...`);
    console.log(data);
    console.log(
      `\n\n>> done in ${(Date.now() - start) / 1000} seconds`,
    );
  });
