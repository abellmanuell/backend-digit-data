const express = require("express");
const router = express.Router();
const { server_response } = require("../../utils/server_response");
const { findUserById, updateUser } = require("../../config/userQuery/userdb");
const { body, matchedData, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const changePasswordRouter = router.put(
  "/",
  [
    body("old_password").trim(),
    body("new_password").trim(),
    body("confirm_password").trim(),
  ],
  async (req, res) => {
    try {
      const result = validationResult(req);
      const id = req.user.userId;

      if (result.isEmpty()) {
        const data = matchedData(req);
        const { access_token, refresh_token, expiry_date, ...others } =
          await findUserById(id);

        /* Reject change of password if user sign up with Google */
        if (Object.hasOwn(others, "google_id")) {
          return server_response(403, res, "You can't change your password");
        }

        /* Compare the current password and the one on database */
        const password = await bcrypt.compare(
          data.old_password,
          others.password
        );

        if (password) {
          const newPassword = await bcrypt.hash(data.new_password, 13);

          const { acknowledged } = await updateUser(id, {
            password: newPassword,
          });
          acknowledged &&
            server_response(200, res, "Successfully change password");
        } else {
          return server_response(403, res, "You enter a wrong password");
        }
      }
    } catch (e) {
      throw new Error(e);
    }
  }
);

module.exports = { changePasswordRouter };
