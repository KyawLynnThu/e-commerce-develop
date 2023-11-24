require('dotenv').config();

const {
  ADMIN_DB_CONNECTION,
  ADMIN_DB_HOST,
  ADMIN_DB_DATABASE,
  ADMIN_DB_USERNAME,
  ADMIN_DB_PASSWORD,
} = process.env;

module.exports = {
  development: {
    username: ADMIN_DB_USERNAME,
    password: ADMIN_DB_PASSWORD,
    database: ADMIN_DB_DATABASE,
    host: ADMIN_DB_HOST,
    dialect: ADMIN_DB_CONNECTION,
    charset: 'utf8',
    collation: 'utf8_unicode_ci',
    timezone: '+06:30',
  },
  test: {
    username: ADMIN_DB_USERNAME,
    password: ADMIN_DB_PASSWORD,
    database: ADMIN_DB_DATABASE,
    host: ADMIN_DB_HOST,
    dialect: ADMIN_DB_CONNECTION,
  },
  production: {
    username: ADMIN_DB_USERNAME,
    password: ADMIN_DB_PASSWORD,
    database: ADMIN_DB_DATABASE,
    host: ADMIN_DB_HOST,
    dialect: ADMIN_DB_CONNECTION,
  },
};
