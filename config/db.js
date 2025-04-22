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

const promisePool = pool.promise();

// Test the connection with a query using the pool
async function testConnection() {
  try {
    const [rows] = await promisePool.query('SELECT NOW() AS currentTime');
    console.log('🕒 Current Time from DB:', rows[0].currentTime);
  } catch (err) {
    console.error('❌ Query failed:', err.message);
  }
}

// Call the test connection function
testConnection();

module.exports = pool.promise();
