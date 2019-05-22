import UserDB from '../UserDB';

const configureUserDB = (userDB: UserDB) =>
  userDB
    .saveUser({
      username: 'admin',
      password: process.env.ADMIN_PW as string,
    })
    .then(() => console.log('Admin user set.\n'))
    .catch(err => console.error(err));

export default configureUserDB;
