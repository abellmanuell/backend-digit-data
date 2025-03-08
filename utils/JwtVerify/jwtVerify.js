const jwt = require("jsonwebtoken");

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

module.exports = { jwtVerify, jwtDecode };
