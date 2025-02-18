const ejs = require("ejs");
const db = require("./db/mysql");
const userRoutes = require("./routes/userRoutes");
const express = require("express");
const path = require("path");

const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/user", userRoutes);

let server = app.listen(3000, function () {
  let port = server.address().port;
  console.log("✅ port", port);
});
