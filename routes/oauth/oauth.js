const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const {
  findUser,
  createUser,
  findUserById,
  updateUser,
} = require("../../config/userQuery/userdb");
const { generateToken } = require("../../utils/JwtVerify/jwtVerify");
require("dotenv").config();

router.get("/", async (req, res) => {
  try {
    async function getUserData({
      access_token,
      token_type,
      refresh_token,
      expiry_date,
    }) {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
      );

      const { sub, email } = await response.json();
      const existingUser = await findUser(email);

      const userOAuthCredentials = {
        access_token,
        token_type,
        refresh_token,
        expiry_date,
        email,
        google_id: sub,
      };

      const isGoogleIdExist = Object.hasOwn(existingUser, "google_id");
      /* Check whether user exist */
      if (existingUser && isGoogleIdExist) {
        const token = generateToken(existingUser);
        return { status: 200, message: "Sign in successfully!", token };
      }

      /* Updated existing user without google_id */
      if (existingUser && !isGoogleIdExist) {
        await updateUser(existingUser._id, userOAuthCredentials);
        const token = generateToken(existingUser);
        return { status: 200, message: "Sign in successfully!", token };
      }

      /* Create user */
      const userCreated = await createUser(userOAuthCredentials);

      if (userCreated.acknowledged) {
        const existingUser =
          userCreated.insertedId &&
          (await findUserById(userCreated.insertedId));
        const token = generateToken(existingUser);

        return { status: 200, message: "Sign in successfully!", token };
      }
    }

    const code = req.query.code;

    const redirectUrl = `${process.env.REDIRECT_URL}/googleme`;

    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectUrl
    );

    /* Get credentials */
    const authResponse = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(authResponse.tokens);
    const credentials = oAuth2Client.credentials;

    const { status, token, message } = await getUserData(credentials);
    res.redirect(
      `${
        process.env.ACCESS_CONTROL_ALLOW_ORIGIN
      }/signin?status=${status}&token=${token}&message=${encodeURIComponent(
        message
      )}`
    );
  } catch (err) {
    console.log(err);

    console.log("Error with signing on Google");
  }
});

module.exports = router;
