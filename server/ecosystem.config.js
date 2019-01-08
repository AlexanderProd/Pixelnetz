/* eslint-disable */
module.exports = {
  apps : [{
    name: 'pixelnetz-server',
    script: 'dist/index.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
  }],

  deploy : {
    production : {
      key: '~/.ssh/pixelnetz-new.pem',
      user: 'pixelnetz',
      host: '3.121.177.95',
      ssh_options: 'StrictHostKeyChecking=no',
      ref: 'origin/master',
      repo: 'git@github.com:AlexanderProd/Pixelnetz.git',
      path: '/home/pixelnetz/test',
      'post-setup': 'yarn && yarn build',
      'post-deploy': 'yarn && yarn build && pm2 reload ecosystem.config.js'
    }
  }
};
