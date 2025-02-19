// userRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const db = require("../db/mysql");

router.get("/register", (req, res) => {
  res.render("register");
});
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const userData = { name, email, password: hashedPassword };

  res.json({
    message: "註冊成功",
    user: userData,
  });
});

module.exports = router;
