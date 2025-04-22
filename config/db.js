const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'om-security.c3qmska06vqw.eu-north-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Gargee09',  
  database: 'om-security',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export promise-based version for async/await usage
module.exports = pool.promise();