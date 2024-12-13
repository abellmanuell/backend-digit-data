var express = require("express");
var app = express();
require("dotenv").config();
var connectDB = require("./config/connectDB/connectdb").connectDB;
var bodyPaser = require("body-parser");
var requestRouter = require("./routes/oauth/request_oauth");
var oAuthRouter = require("./routes/oauth/oauth");
app.options("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "content-type, credentials, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET", "POST");
    res.status(200);
    next();
});
var signupRouter = require("./routes/signup/signup");
app.use(bodyPaser.json());
app.use("/authenticate", oAuthRouter);
app.use("/google-oauth-request", requestRouter);
app.use("/signup", signupRouter);
app.get("/", function (req, res) {
    res.send("Nodejs expxress");
});
var _a = process.env, PORT = _a.PORT, HOSTNAME = _a.HOSTNAME;
app.listen(PORT, HOSTNAME, function () {
    console.log("Server running on ".concat(HOSTNAME, ":").concat(PORT));
    connectDB().catch(console.error);
});
