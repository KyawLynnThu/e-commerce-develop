const cors = require('cors');
const express = require('express');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocument = YAML.load('./src/views/api.yaml');
const errorMiddleware = require('./src/middlewares/errorMiddleware');
const router = require('./src/routes/index');

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: './src/locales/{{lng}}/translation.json',
    },
  });

const app = express();

const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));
app.use(middleware.handle(i18next));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

app.use('/api', router);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use(errorMiddleware);
module.exports = app;
