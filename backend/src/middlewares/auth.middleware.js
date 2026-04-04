const jwt = require("jsonwebtoken");
const jwtUtil = require("../utils/jwt.util");

function authenticateUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwtUtil.verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
}

module.exports = { authenticateUser };
