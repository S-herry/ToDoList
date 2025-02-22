const jsonwebtoken = require("jsonwebtoken");
const _ = require("lodash");

const SECRET = "TO_DO_LIST"; // 簽發 JWT 時使用的密鑰

async function verifyToken(jwt) {
  if (!jwt || !jwt.startsWith("Bearer ")) {
    throw new Error("未提供有效的 Token");
  }

  const token = jwt.split(" ")[1]; // 真正的 Token
  console.log("收到的 Token:", token);

  try {
    return jsonwebtoken.verify(token, SECRET); // 解析 Token
  } catch (err) {
    throw new Error("Token 無效或已過期");
  }
}

module.exports = function (option = {}) {
  const { tokenPath = "headers.authorization" } = option;
  return function (req, res, next) {
    const jwt = _.get(req, tokenPath);

    verifyToken(jwt)
      .then((decoded) => {
        req.user = decoded;
        next();
      })
      .catch((err) => {
        res.status(403).json({ message: err.message });
      });
  };
};
