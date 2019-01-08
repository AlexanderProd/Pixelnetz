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
      NODE_ENV: 'production',
      ADMIN_PW: 'admin',
      JWT_SECRET: '2psPxwr0n3z4R95vIocgRabt1AJZ9jH6bJHrZUoR6V9Mq0poilWbFqkddbYq7Upf',
      SALT_ROUNDS: '10'
    },
  }],
};
