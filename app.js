const ejs = require("ejs");
const db = require("./db/mysql");
const userRoutes = require("./routes/userRoutes"); // 路由
const eventRoutes = require("./routes/eventRoutes"); // 路由
const express = require("express");
const path = require("path");
const verifyJWT = require("./routes/verifyJWT");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 解析 URL 編碼數據

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// app.use(verifyJWT({ tokenPath: "headers.authorization" }));
app.get("/verify-token", verifyJWT(), (req, res) => {
  res.json({ message: "Token 有效", user: req.user });
});

app.get("/", (req, res) => {
  try {
    res.render("index");
  } catch (err) {
    return res.status(403).json({ message: "Token 无效" });
  }
});

app.use("/user", userRoutes);
app.use("/events", eventRoutes);

let server = app.listen(3000, function () {
  let port = server.address().port;
  console.log("✅ port", port);
});
