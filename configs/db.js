const mysql = require('mysql2');
const config = require('./config.json');

let host = config.environment === "dev" ? config.dbConfig.development.host : config.dbConfig.production.host;
let user = config.environment === "dev" ? config.dbConfig.development.user : config.dbConfig.production.user;
let password = config.environment === "dev" ? config.dbConfig.development.password : config.dbConfig.production.password;
let database = config.environment === "dev" ? config.dbConfig.development.database : config.dbConfig.production.database;

let pool = mysql.createPool({
    host: host,
    user: user,
    password: password,
    database: database,
    connectionLimit: 80, //important
    connectTimeout: 60 * 60 * 1000,
    // acquireTimeout: 60 * 60 * 1000,
    // timeout: 60 * 60 * 1000,
    debug: false
});
exports.getConnection = function (callback) {
    pool.getConnection(function (err, connection) {
        callback(err, connection, pool);
    });
};