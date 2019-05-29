import fetch from 'node-fetch';
import fs from 'fs';
import png from './large_jpeg';

// const fd = new FormData();
// fd.append('data', png);

const gif = fs.readFileSync(
  `${__dirname}/../../../test_images/x.gif`,
);
const start = Date.now();
fetch(
  'http://localhost:8000/rasterize?format=gif&bit_depth=7&max_width=100',
  {
    method: 'POST',
    body: gif,
  },
)
  .then(async r => {
    if (r.ok) {
      return r.json();
    }
    return {
      error: await r.text(),
    };
  })
  .then(({ error, matrices, ...data }) => {
    if (error) {
      console.error(error);
      return;
    }
    // fs.writeFileSync(`${__dirname}/y.matrix.0.json`, r, 'utf-8');
    console.log(`${matrices[0].substring(0, 700)}...`);
    console.log(data);
    console.log(
      `\n\n>> done in ${(Date.now() - start) / 1000} seconds`,
    );
  });
