const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

async function getUserData({
  access_token,
  token_type,
  refresh_token,
  expiry_date,
}) {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );

  const data = await response.json();
  const user = { access_token, token_type, refresh_token, expiry_date };
  console.log(user);
}

router.get("/", async (req, res) => {
  try {
    const code = req.query.code;

    const redirectUrl = `${process.env.REDIRECT_URL}/googleme`;

    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectUrl
    );

    const res = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(res.tokens);
    console.log("token acquired");

    const credentials = oAuth2Client.credentials;
    await getUserData(credentials);
  } catch (err) {
    console.log(err);

    console.log("Error with signing on Google");
  }
  res.redirect(`${process.env.ACCESS_CONTROL_ALLOW_ORIGIN}/dashboard`);
});

module.exports = router;
