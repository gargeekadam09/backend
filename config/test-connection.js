const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'om-security.c3qmska06vqw.eu-north-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Gargee09',
  database: 'om-security'
});

console.log('Attempting to connect...');

connection.connect((err) => {
  if (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }

  console.log('✅ Connected to AWS RDS MySQL!');
  connection.query('SELECT NOW() AS currentTime', (err, results) => {
    if (err) {
      console.error('❌ Query failed:', err.message);
      process.exit(1);
    }

    console.log('🕒 Current Time from DB:', results[0].currentTime);
    connection.end(); // Close the connection
    process.exit(0);
  });
});
