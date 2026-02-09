const mysql = require("mysql2");
require("dotenv").config();

// Create a connection pool (better for cloud)
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "your_local_password", // Put your local workbench password here for safety
  database: process.env.DB_NAME || "hostel_maintenance",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false // Required for most cloud databases
  }
});

// Convert pool to promise-based (so we can use await)
const promisePool = pool.promise();

module.exports = promisePool;