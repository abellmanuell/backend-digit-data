const express = require("express");
const app = express();
require("dotenv").config();
const bodyPaser = require("body-parser");

const { connectDB } = require("./config/connectDB/connectdb");
const requestRouter = require("./routes/oauth/request_oauth");
const oAuthRouter = require("./routes/oauth/oauth");

app.options("*", (req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.ACCESS_CONTROL_ALLOW_ORIGIN
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "content-type, credentials, X-Requested-With, authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PUT, DELETE");
  res.status(200);
  res.end();
});

const signupRouter = require("./routes/signup/signup");
const signinRouter = require("./routes/signin/signin");
const {
  userRouter,
  editUserProfileRouter,
} = require("./routes/userRouter/user");
const refreshTokenRouter = require("./routes/refreshTokenRouter/refreshToken");
const topUpRouter = require("./routes/topupRouter/topup");
const networksRouter = require("./routes/networksRouter/networks");
const airtimeTypeRouter = require("./routes/airtimeTypeRouter/airtimeType");

const { server_response } = require("./utils/server_response");
const { jwtVerify } = require("./utils/JwtVerify/jwtVerify");

app.use(bodyPaser.json());

app.use("/authenticate", oAuthRouter);
app.use("/google-oauth-request", requestRouter);
app.use("/signup", signupRouter);
app.use("/signin", signinRouter);
app.use("/api/refresh-token", refreshTokenRouter);
app.use("/api/networks", networksRouter);
app.use("/api/airtime-type", airtimeTypeRouter);

app.get("/", (req, res) => {
  res.send("Digi Data Application");
});

app.all("/api/*", requiredAuthentication);
app.use("/api/user", userRouter);
app.use("/api/user/profile/edit", editUserProfileRouter);
app.use("/api/topup", topUpRouter);

async function requiredAuthentication(req, res, next) {
  try {
    const decoded = await jwtVerify(req);
    req.user = decoded;
    next();
  } catch {
    return server_response(401, res, "Unauthorized access");
  }
}

const { PORT, HOSTNAME } = process.env;
app.listen(PORT, () => {
  console.log(`Server running on ${HOSTNAME}:${PORT}`);
  connectDB().catch(console.error);
});

module.exports = app;
