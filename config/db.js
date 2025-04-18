const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',  // Default XAMPP password is empty
  database: 'pageturner_servicestore',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export promise-based version for async/await usage
module.exports = pool.promise();