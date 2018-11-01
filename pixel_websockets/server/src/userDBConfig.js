module.exports = userDB => userDB
  .saveUser({ username: 'admin', password: process.env.ADMIN_PW })
  .then(() => console.log('Admin user set.\n'))
  .catch(err => console.error(err));
