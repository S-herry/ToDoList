const mysql = require("mysql2/promise");
const CreateUserDB = require("./user");
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "todolistdb",
  waitForConnections: true,
  connectionLimit: 10, // 限制最大连接数
  queueLimit: 0,
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.query(CreateUserDB());

    console.log("✅ DB數據連接");
    connection.release();
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

testConnection();

module.exports = pool; // 导出连接池，供其他模块使用
