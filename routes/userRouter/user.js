const express = require("express");
const { server_response } = require("../../utils/server_response");
const { findUserById } = require("../../config/userDB/userdb");
const { body, matchedData } = require("express-validator");
const router = express.Router();

const userRouter = router.get("/", async (req, res, next) => {
  const { password, ...other } = await findUserById(req.user.userId);

  if (!req.user) {
    return server_response(404, res, "Error occured");
  }

  return server_response(200, res, "Successfully completed", other);
});

const editUserProfileRouter = router.put(
  "/",
  [
    body("given_name").trim(),
    body("family_name").trim(),
    body("email").trim(),
    body("phone_number").trim(),
  ],
  (req, res) => {
    try {
      const data = matchedData(req);
      console.log(data);

      const { given_name, family_name, phone_number } = data;
      if (given_name && family_name && phone_number) {
        console.log(5);
      }
    } catch {}
  }
);

module.exports = { userRouter, editUserProfileRouter };
