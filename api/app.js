// Configuring the environment
require('dotenv').config();

// Importing npm dependencies
const express = require('express');
const morgan = require('morgan');
const http = require('http');
const cors = require('cors');

// Importing app dependencies
const winston = require('./config/winston');
const dbConfig = require('./config/db-config');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const app = express();
const port = process.env.API_SERVER_PORT || 3000;

// Configure database and model entities.
dbConfig.initialize((err) => {
  if (err) {
    winston.error(`Error occurred while connecting to database, ${err}`);
    process.exit(1);
  } else {
    app.use(cors({
      origin: '*'
    }));
    // Logging all request coming to the API server to the console.
    app.use(morgan('dev'));
    // Parsing request body.
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    const onListening = () => {
      winston.info(`Server started on port: '${port}'`);
      winston.info(`Swagger UI can be accessed at http://${process.env.SERVER_IP}:${process.env.API_SERVER_PORT}/v1.0/api-docs`);
    };

    const onError = (error) => {
      switch (error.code) {
        case 'EACCES':
          winston.error(`Port '${port}' requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          winston.error(`Port '${port}' is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    };

    // Creating server
    const server = http.createServer(app);
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
  }
});
