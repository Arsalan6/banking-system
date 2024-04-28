// npm dependencies
const glob = require('glob');
const path = require('path');
const async = require('async');
const Sequelize = require('sequelize');
const mysql = require('mysql2/promise');

// app dependencies
const winston = require('./winston');

const db = {};
let sequelize;

module.exports = {
  /**
   * This method will initialize database and all model entities
   * @param callback
   */
  initialize(callback) {
    async.series(
      [
        (createDB) => {
          mysql.createConnection({
            host: process.env.DB_SERVER_IP,
            port: process.env.DB_PORT || "3306",
            user: process.env.DB_USER_NAME,
            password: process.env.DB_PASSWORD,
          }).then(connection => {
            connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`).then((res) => {
              winston.info(`Database with name ${process.env.DB_NAME} create or successfully checked`);
            })
            createDB();
          }).catch(err => {
            winston.error(`Error occurred while creating database with name ${process.env.DB_NAME}, ${err}`);
          })
        },
        (envCb) => {
          // Connecting to Database
          winston.info(`API Server started for environment[${process.env.NODE_ENV}]`);
          const dialectConfig = {
            dialect: 'mysql',
            host: process.env.DB_SERVER_IP,
          };
          if (process.env.NODE_ENV === 'production') {
            dialectConfig.dialectOptions = {
              ssl: {
                required: true,
              }
            };
          }
          sequelize = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER_NAME,
            process.env.DB_PASSWORD,
            dialectConfig,
          );
          sequelize
            .authenticate()
            .then(() => {
              winston.info('Database connection established successfully.');
              envCb();
            })
            .catch((err) => {
              winston.error('Unable to connect to the database:', err);
              envCb(err);
            });
        },
        (modelsCb) => {
          // load all models
          const routePath = 'models/*.js';
          glob.sync(routePath).forEach((file) => {
            const model = require(path.join('../', file))(sequelize, Sequelize.DataTypes);
            db[model.name] = model;
          });
          Object.keys(db).forEach((modelName) => {
            if (db[modelName].associate) {
              db[modelName].associate(db);
            }
          });

          db.sequelize = sequelize;
          db.Sequelize = Sequelize;

          modelsCb();
        }
      ],
      (err) => {
        if (err) {
          return callback(err);
        }
        return callback();
      },
    );
  },
  getDbInstance() {
    return db;
  }
};