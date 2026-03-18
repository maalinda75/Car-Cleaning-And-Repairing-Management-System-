const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "Malinda@2001",
    database: "car_cleaning_system",
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection pool
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        console.error("Make sure your MySQL server is running on port 3306 and the password is correct.");
    } else {
        console.log("Database connected successfully using pool to 'car_cleaning_system'");
        connection.release();
    }
});

module.exports = pool;