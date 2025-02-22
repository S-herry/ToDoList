const mysql = require("mysql2");
const CreateUserDB = require("./user");
const CreateEventsDB = require("./events");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "todolistdb",
  waitForConnections: true,
  connectionLimit: 10, // 限制最大连接数
  queueLimit: 0,
});

connection.connect((err) => {
  if (!err) {
    console.log("✅ DB數據連接");

    connection.query(CreateUserDB(), (UseDBerr, results) => {
      if (UseDBerr) {
        console.error("❌ 表單創建失敗:", UseDBerr);
      } else {
        console.log("✅ `user` 已創建");
      }
    });
    connection.query(CreateEventsDB(), (EventDBerr, results) => {
      if (EventDBerr) {
        console.error("❌  表單創建失敗:", EventDBerr);
      } else {
        console.log("✅ `events`已創建");
      }
    });
  }
});

module.exports = connection; // 导出连接池，供其他模块使用
