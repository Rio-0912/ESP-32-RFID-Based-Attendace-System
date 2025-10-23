// db.js - MySQL database config
const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'IOT'
});

module.exports = db;
