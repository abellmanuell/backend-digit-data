const express = require("express");
const app = express();
require("dotenv").config();
const bodyPaser = require("body-parser");
const jwt = require('jsonwebtoken')

const { connectDB } = require("./config/connectDB/connectdb");
const requestRouter = require("./routes/oauth/request_oauth");
const oAuthRouter = require("./routes/oauth/oauth");

app.options("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "content-type, credentials, X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "GET", "POST");
  res.status(200);
  next();
});

const signupRouter = require("./routes/signup/signup");
const signinRouter = require("./routes/signin/signin");
const userRouter = require("./routes/userRouter/user")

const { server_response } = require("./utils/server_response");

app.use(bodyPaser.json());

app.use("/authenticate", oAuthRouter);
app.use("/google-oauth-request", requestRouter);
app.use("/signup", signupRouter);
app.use("/signin", signinRouter)

app.all("/api/*", requiredAuthentication)
app.use("/api/user", userRouter)

async function requiredAuthentication(req, res, next){
  const authorization = req.headers.authorization;
  const token = authorization && authorization.split(" ")[1];
  
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err,decoded)=>{
    if(err){
      return server_response(401, res, "Unauthorized")
    }
    req.user = decoded;
    next()
  })


}

app.get("/", (req, res) => {
  res.send("Nodejs expxress");
});

const { PORT, HOSTNAME } = process.env;
app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running on ${HOSTNAME}:${PORT}`);
  connectDB().catch(console.error);
});
