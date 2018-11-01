const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

module.exports = (app, express) => {
  app.use('/', express.static(`${__dirname}../../../dist_frontend/`));

  app.use('/master', express.static(`${__dirname}../../../dist_master/`));

  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(bodyParser.json());

  app.use(cookieParser());

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, x-access-token',
    );
    next();
  });
};
