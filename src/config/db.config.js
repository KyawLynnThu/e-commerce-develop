require('dotenv').config();

const { DB_CONNECTION, DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD } =
  process.env;

module.exports = {
  development: {
    username: DB_USERNAME || 'root',
    password: DB_PASSWORD || 'root',
    database: DB_DATABASE || 'database_development',
    host: DB_HOST || '127.0.0.1',
    dialect: DB_CONNECTION || 'mysql',
    charset: 'utf8',
    collation: 'utf8_unicode_ci',
    timezone: '+06:30',
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    dialect: DB_CONNECTION,
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    dialect: DB_CONNECTION,
  },
};
