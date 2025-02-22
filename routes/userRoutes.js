// userRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const db = require("../db/mysql");
const jwt = require("jsonwebtoken");
const SECRET = "TO_DO_LIST"; // 簽發 JWT 時使用的密鑰

router.get("/register", (req, res) => {
  res.render("register");
});
router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || name.length < 3) {
    return res.status(400).json({ message: "使用者名稱太短，至少 3 個字元" });
  }
  if (!email || email.length < 8) {
    return res.status(400).json({ message: "email太短，至少 8 個字元" });
  }
  if (!password || password.length < 8) {
    return res.status(400).json({ message: "密碼太短，至少 8 個字元" });
  }
  try {
    const checkEmailQuery = "SELECT * FROM user WHERE email =?";
    db.query(checkEmailQuery, [email], async (err, results) => {
      if (!err) {
        if (results.length > 0) {
          return res.status(400).json({ message: "此 Email 已被註冊" });
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const insertUserQuery =
          "INSERT INTO user (name, email, password) VALUES (?, ?, ?)";
        db.query(
          insertUserQuery,
          [name, email, hashedPassword],
          (insertErr, result) => {
            if (!insertErr) {
              return res.status(201).json({
                message: "註冊成功",
                user: { id: result.id },
              });
            }
          }
        );
      }
    });
  } catch (err) {
    console.error("❌ 註冊錯誤:", error);
    return res.status(500).json({ message: "伺服器錯誤" });
  }

  res.json(200, {
    message: "註冊成功",
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || email.length < 8) {
    return res.status(400).json({ message: "email太短，至少 8 個字元" });
  }
  if (!password || password.length < 8) {
    return res.status(400).json({ message: "密碼太短，至少 8 個字元" });
  }
  try {
    const checkEmailQuery = "SELECT * FROM user WHERE email =?";
    db.query(checkEmailQuery, [email], async (err, results) => {
      if (err) {
        console.error("❌ 檢查 email 錯誤:", err);
        return res.status(500).json({ message: "伺服器錯誤，請稍後再試" });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "帳號不存在" });
      }
      const user = results[0];
      const checkPassword = await bcrypt.compare(password, user.password);
      const { name, email, id } = user;
      if (checkPassword) {
        const token = jwt.sign(
          {
            name,
            email,
            id,
          },
          SECRET,
          { expiresIn: "10m" }
        );

        return res.status(200).json({ message: "成功", token: token });
      } else {
        return res.status(400).json({ message: "密碼錯誤" });
      }
    });
  } catch (err) {
    console.error("❌ 登入錯誤:", err);
    return res.status(500).json({ message: "伺服器錯誤" });
  }
});

router.get("/signout", (req, res) => {
  res.status(200).json({ message: "登出成功" });
});
module.exports = router;
