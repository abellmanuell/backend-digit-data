const express = require("express");
const app = express();
require("dotenv").config();
const bodyPaser = require("body-parser");


const { connectDB } = require("./config/connectDB/connectdb");
const requestRouter = require("./routes/oauth/request_oauth");
const oAuthRouter = require("./routes/oauth/oauth");

app.options("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.ACCESS_CONTROL_ALLOW_ORIGIN);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "content-type, credentials, X-Requested-With, authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET", "POST");
  res.status(200);
  res.end()
});

const signupRouter = require("./routes/signup/signup");
const signinRouter = require("./routes/signin/signin");
const userRouter = require("./routes/userRouter/user")
const refreshTokenRouter = require("./routes/refreshTokenRouter/refreshToken")

const { server_response } = require("./utils/server_response");
const { jwtVerify } = require("./utils/JwtVerify/jwtVerify");

app.use(bodyPaser.json());

app.use("/authenticate", oAuthRouter);
app.use("/google-oauth-request", requestRouter);
app.use("/signup", signupRouter);
app.use("/signin", signinRouter)
app.use("/api/refresh-token", refreshTokenRouter)

app.all("/api/*", requiredAuthentication)
app.use("/api/user", userRouter)

async function requiredAuthentication(req, res, next){
  try{
    const decoded = await jwtVerify(req)
    req.user = decoded;
    next()
  }catch{
    return server_response(401, res, "Unauthorized")
  }
}

app.get("/", (req, res) => {
  res.send("Nodejs expxress");
});

const { PORT, HOSTNAME } = process.env;
app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running on ${HOSTNAME}:${PORT}`);
  connectDB().catch(console.error);
});
