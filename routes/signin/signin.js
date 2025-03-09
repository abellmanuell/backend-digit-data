const express = require("express");
const { body, validationResult, matchedData } = require("express-validator");
const { findUser } = require("../../config/userQuery/userdb");
const router = express.Router();
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { server_response } = require("../../utils/server_response");

router.post(
  "/",
  [
    body("email")
      .trim()
      .notEmpty()
      .isEmail()
      .withMessage("Email address incorrect"),
    body("password")
      .notEmpty()
      .isLength({ min: 8 })
      .withMessage("Password should be at least 8 character"),
  ],
  async (req, res) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const data = matchedData(req);
      const isUserExist = await findUser(data);

      if (!isUserExist) {
        return server_response(404, res, "Account does not exist!");
      }

      const password = await bcrypt.compare(
        data.password,
        isUserExist.password
      );

      if (password) {
        const { password, ...user } = isUserExist;

        const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );

        return server_response(200, res, "Sign successfully!", {
          token,
        });
      } else {
        return server_response(404, res, "Password is incorrect!");
      }
    }

    res.send({ error: result.array() });
  }
);

module.exports = router;
