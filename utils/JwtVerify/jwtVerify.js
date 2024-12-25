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

module.exports = { jwtVerify };
