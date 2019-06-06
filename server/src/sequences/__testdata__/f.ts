import fetch from 'node-fetch';
import axios from 'axios';
import fs from 'fs';
import png from './large_jpeg';

const gif = fs.readFileSync(
  `${__dirname}/../../../test_images/x.gif`,
);
const start = Date.now();
axios
  .post(
    'http://localhost:4757/rasterize?format=gif&bit_depth=8&max_width=100',
    gif,
    { maxContentLength: Infinity },
  )
  .then(res => res.data)
  .then(({ matrices, ...data }) => {
    console.log(`${matrices[0].substring(0, 300)}...`);
    console.log(data);
    console.log(
      `\n\n>> done in ${(Date.now() - start) / 1000} seconds`,
    );
  })
  .catch(err => console.error(err));
