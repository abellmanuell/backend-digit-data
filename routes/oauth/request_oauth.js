const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

router.post("/", async (req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.ACCESS_CONTROL_ALLOW_ORIGIN
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Referrer-Policy", "no-referrer-when-downgrade");

  const redirectUrl = `${process.env.HOSTNAME}:${process.env.PORT}/googleme`;

  const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirectUrl
  );

  const authorizedUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/userinfo.profile openid",
    prompt: "consent",
  });

  console.log("Get Google Oauth URL", authorizedUrl);
  res.json({ url: authorizedUrl });
});

module.exports = router;
