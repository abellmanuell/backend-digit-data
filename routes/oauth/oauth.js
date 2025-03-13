const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const {
  findUser,
  createUser,
  findUserById,
} = require("../../config/userQuery/userdb");
const { server_response } = require("../../utils/server_response");
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

      /* Check whether user exist */
      if (existingUser) {
        const isGoogleIdExist = Object.hasOwn(existingUser, "google_id");

        /* Check if user has GOOGLE_ID */
        if (isGoogleIdExist) {
          const token = generateToken(existingUser);
          return server_response(200, res, "Sign in successfully!", {
            token,
          });
        } else {
          return server_response(
            403,
            res,
            "Oops! You previously signed up with your email and password. Please sign in using your email and password instead of Google."
          );
        }
      }

      const newUser = {
        access_token,
        token_type,
        refresh_token,
        expiry_date,
        sub,
        email,
      };

      const userCreated = await createUser(newUser);

      if (userCreated.acknowledged) {
        const existingUser =
          userCreated.insertedId &&
          (await findUserById(userCreated.insertedId));
        const token = generateToken(existingUser);

        return server_response(200, res, "Sign in successfully!", {
          token,
        });
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

    await getUserData(credentials);
  } catch (err) {
    console.log(err);

    console.log("Error with signing on Google");
  }
  res.redirect(`${process.env.ACCESS_CONTROL_ALLOW_ORIGIN}/signin`);
});

module.exports = router;
