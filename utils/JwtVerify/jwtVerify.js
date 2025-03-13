const jwt = require("jsonwebtoken");
require("dotenv").config();

async function jwtVerify(req) {
  const authorization = req.headers.authorization;
  const token = authorization && authorization.split(" ")[1];
  if (token) {
    return await jwt.verify(token, process.env.JWT_SECRET_KEY);
  } else {
    throw new Error("No JWT Token");
  }
}

async function jwtDecode(req) {
  const authorization = req.headers.authorization;
  const token = authorization && authorization.split(" ")[1];

  if (token) {
    const decoded = jwt.decode(token);
    const now = Math.floor(Date.now() / 1000);
    const expirationTime = decoded.exp;
    return {
      token,
      isExpired: expirationTime > now && expirationTime < now + 3600,
    };
  }
}

function generateToken(user) {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  return token;
}

module.exports = { jwtVerify, jwtDecode, generateToken };
