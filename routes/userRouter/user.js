const express = require("express");
const { server_response } = require("../../utils/server_response");
const { findUserById, updateUser } = require("../../config/userQuery/userdb");
const { body, matchedData, validationResult } = require("express-validator");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const userRouter = router.get("/", async (req, res, next) => {
  const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );

  async function refreshAccessToken(refreshToken) {
    try {
      oAuth2Client.setCredentials({ refresh_token: refreshToken });

      // Request new tokens
      const { credentials } = await oAuth2Client.refreshAccessToken();

      console.log("New access token:", credentials.access_token);

      return credentials; // Return new access token and expiry info
    } catch (err) {
      console.error("Error refreshing token:", err);
      throw new Error("Failed to refresh access token");
    }
  }

  const {
    access_token,
    token_type,
    refresh_token,
    expiry_date,
    password,
    ...others
  } = await findUserById(req.user.userId);

  if (!req.user) {
    return server_response(404, res, "Error occured");
  }

  if (Date.now() >= expiry_date) {
    console.log("Access token expired, refreshing...");
    const newTokens = await refreshAccessToken(refresh_token);

    // Update the stored access token and expiry time
    access_token = newTokens.access_token;
    refresh_token = newTokens.refresh_token;
    token_type = newTokens.token_type;
    expiry_date = Date.now() + newTokens.expiry_date * 1000;

    await updateUser(others._id, {
      access_token: newTokens.access_token,
      refresh_token: newTokens.refresh_token,
      token_type: newTokens.token_type,
      expiry_date: Date.now() + newTokens.expiry_date * 1000,
    });
  }

  // Check if there's google_id to know which data to return
  if (Object.hasOwn(others, "google_id")) {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
    );

    const { email, given_name, family_name } = await response.json();
    return server_response(200, res, "Successfully completed", {
      ...others,
      email,
      given_name,
      family_name,
    });
  }

  // Return data
  return server_response(200, res, "Successfully completed", others);
});

const editUserProfileRouter = router.put(
  "/",
  [
    body("given_name").trim(),
    body("family_name").trim(),
    body("email").trim().notEmpty().isEmail(),
    body("mobile_number").trim(),
  ],
  async (req, res) => {
    try {
      const result = validationResult(req);
      const id = req.user.userId;

      if (result.isEmpty()) {
        const data = matchedData(req);
        const { acknowledged } = await updateUser(id, data);
        if (acknowledged) {
          const {
            password,
            access_token,
            refresh_token,
            expiry_date,
            ...other
          } = await findUserById(id);
          return server_response(200, res, "Successfully updated", {
            data: { ...other },
          });
        }
      } else {
        return server_response(404, res, "Email address is required");
      }
    } catch {
      throw new Error();
    }
  }
);

module.exports = { userRouter, editUserProfileRouter };
