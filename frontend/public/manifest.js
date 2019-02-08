/* eslint-disable camelcase */
const path = require('path');

const manifest = {
  name: 'Pixelnetz',
  short_name: 'Pixelnetz',
  description: 'Be Part of the Show!',
  background_color: '#000000',
  icons: [{
    src: path.resolve(__dirname, '/../../logo.png'),
    sizes: [96, 128, 192, 256, 384, 512],
  }],
};

module.exports = manifest;
