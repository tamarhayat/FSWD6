const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'tahi',
  password: 'tahi1212!',
  database: 'fullstuck6_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
