const ejs = require("ejs");
const db = require("./db/mysql");
const jwt = require("jsonwebtoken");

const userRoutes = require("./routes/userRoutes"); // 路由
const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 解析 URL 編碼數據

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "未提供 Token" });
  }
  const decoded = jwt.verify(token, "secret");
  res.render("index");
});

app.use("/user", userRoutes);

let server = app.listen(3000, function () {
  let port = server.address().port;
  console.log("✅ port", port);
});
