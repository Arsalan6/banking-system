# banking-system
Banking system Web App for CMP9134M Advanced Software Engineering 

# API

#### Getting Started

##### Pre-requisite

###### Install MySQL
Download and install [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

Once installed, MySQL can be accessed by using following command in command prompt.
```sh
$ mysql -u<db-username> -p<db-accountpassword>
```

Create `bank_system_app` database using this command:
```sh
$ CREATE SCHEMA `bank_system_app`;
```
######  Update Environment file

Update environment file ```.env``` in server directory as per your environment configurations.
```sh
/api/.env ;
```


#####  Install Dependencies
Install the dependencies and devDependencies by running this command.
```sh
$ npm install
```
#####  Install Sequelize
Install the [Sequelize Cli](https://www.npmjs.com/package/sequelize-cli) globally to run its commands.
```sh
$ npm i sequelize-cli -g
```
#####  Run Sequelize migrations
Run this command to install all Sql Migrations.
```sh
$ npx sequelize-cli db:migrate
```

#####  For seed file
Run this command in order to use the seed file.
```sh
$ npx sequelize-cli db:seed:all || npx sequelize-cli db:seed --seed seed_file_name.js
```

#####  Start Server using PM2

Install [PM2](http://pm2.keymetrics.io/docs/usage/quick-start/) using this command
```sh
$ npm install pm2 -g
```
Start application using this command
```sh
$ pm2 start app.js
```
