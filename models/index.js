const config = require("../configs/config.json");

const Sequelize = require("sequelize");

let host = config.environment === "dev" ? config.dbConfig.development.host : config.dbConfig.production.host;
let user = config.environment === "dev" ? config.dbConfig.development.user : config.dbConfig.production.user;
let password = config.environment === "dev" ? config.dbConfig.development.password : config.dbConfig.production.password;
let database = config.environment === "dev" ? config.dbConfig.development.database : config.dbConfig.production.database;

const sequelize = new Sequelize(database, user, password, {
    host: host,
    dialect: "mysql",
    operatorsAliases: false,
    pool: {
        max: 100,
        min: 0,
        acquire: 30000,
        idle: 10000,
        connectTimeout: 60000
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((err) => {
        console.log('Unable to connect to the database:', err);
    });


const sequelizeDB = {};

sequelizeDB.Sequelize = Sequelize;
sequelizeDB.sequelize = sequelize;
sequelizeDB.restaurant = require("./restaurant")(sequelize, Sequelize);
module.exports = sequelizeDB;