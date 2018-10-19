const { exec } = require('child_process');

const hostname = () => new Promise((resolve, reject) => exec(
  'hostname -I',
  (err, stdout) => {
    if (err) reject(err);
    else resolve(stdout.split(' ')[0]);
  },
));

module.exports = hostname;
