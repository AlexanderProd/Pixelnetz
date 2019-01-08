const childProcess = require('child_process');
const { promisify } = require('util');
const chokidar = require('chokidar');
const exec = promisify(childProcess.exec);

chokidar.watch('./src', { ignoreInitial: true })
  .on('all', (event, path) => {
    console.log(`>> ${event} in ${path}\n`);
    exec('yarn build')
      .then(({ stdout, stderr }) => {
        console.log(stdout);
        console.error(stderr, '\n');
      })
      .catch(err => console.error('ERROR: ', err, '\n'));
  });
