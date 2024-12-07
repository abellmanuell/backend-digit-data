const express = require("express");
const app = express();
require("dotenv").config();

const {connectDB} = require("./config/connectDB/connectdb");

const bodyPaser = require('body-parser')
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

const signupRouter = require('./routes/signup/signup')

app.use(bodyPaser.json())

app.use("/authenticate", oAuthRouter);
app.use("/google-oauth-request", requestRouter);
app.use("/signup", signupRouter)

app.get("/", (req, res) => {
  res.send("Nodejs expxress");
});

const { PORT, HOSTNAME } = process.env;
app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running on ${HOSTNAME}:${PORT}`);
  connectDB()
      .catch(console.error)
});
