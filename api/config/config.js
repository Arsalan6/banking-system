require('dotenv').config();

const dialectOptions = {};
if (process.env.NODE_ENV === 'production') {
  dialectOptions.ssl = {
    required: true
  };
}

module.exports = {
  development: {
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: 'mysql',
    host: process.env.DB_SERVER_IP,
    dialectOptions
  },
  test: {
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: 'mysql',
    host: process.env.DB_SERVER_IP,
    dialectOptions
  },
  production: {
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: 'mysql',
    host: process.env.DB_SERVER_IP,
    dialectOptions
  },
};