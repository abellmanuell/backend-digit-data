const express = require("express");
const { server_response } = require("../../utils/server_response");
const { findUserById, updateUser } = require("../../config/userQuery/userdb");
const { body, matchedData, validationResult } = require("express-validator");
const router = express.Router();

const userRouter = router.get("/", async (req, res, next) => {
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

  // Check if there's google_id to know which data to return
  if (Object.hasOwn(others, "google_id")) {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${others.access_token}`
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
    body("phone_number").trim().isNumeric(),
  ],
  async (req, res) => {
    try {
      const result = validationResult(req);
      const id = req.user.userId;

      if (result.isEmpty) {
        const data = matchedData(req);
        const { acknowledged } = await updateUser(id, data);
        if (acknowledged) {
          const { password, ...other } = await findUserById(id);
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
