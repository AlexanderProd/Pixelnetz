import helmet from 'helmet';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import compressionMiddleware from '../util/compressionMiddleware';
import { isDev } from '../util/env';

const configureApp = (app, express) => {
  app.use(helmet());

  compressionMiddleware(app);

  app.use(
    '/',
    express.static(
      `${__dirname}/../../../../../dist/static/frontend/`,
    ),
  );

  app.use(
    '/master',
    express.static(`${__dirname}/../../../../../dist/static/master/`),
  );

  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(bodyParser.json());

  app.use(fileUpload());

  if (isDev()) {
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, x-access-token',
      );
      next();
    });
  } else {
    const whitelist = [
      'http://bepartoftheshow.de',
      'https://bepartoftheshow.de',
    ];
    const corsOptions = {
      origin(origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      optionsSuccessStatus: 200,
    };
    app.use(cors(corsOptions));
  }
};

export default configureApp;
