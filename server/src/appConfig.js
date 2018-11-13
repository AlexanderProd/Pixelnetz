import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

const configureApp = (app, express) => {
  app.use('/', express.static(`${__dirname}/../../dist/static/frontend/`));

  app.use('/master', express.static(`${__dirname}/../../dist/static/master/`));

  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(bodyParser.json());

  app.use(cookieParser());

  if (process.env.PRODUCTION !== 'true') {
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, x-access-token',
      );
      next();
    });
  }
};

export default configureApp;
