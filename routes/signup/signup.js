const express = require("express");
const { body, validationResult, matchedData } = require("express-validator");
const {
  findUser,
  createUser,
  findUserById,
} = require("../../config/userQuery/userdb");
const router = express.Router();
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  refreshToken,
} = require("../../utils/generateRefreshToken/generateRefreshToken");
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

      if (isUserExist) {
        return server_response(401, res, "Email address is taken!");
      }

      const password = await bcrypt.hash(data.password, 13);
      const userCreated = await createUser({
        email: data.email,
        password,
        given_name: "",
        family_name: "",
        phone_number: "",
        wallet_balance: 0,
      });

      if (userCreated.acknowledged) {
        const { password, ...user } =
          userCreated.insertedId &&
          (await findUserById(userCreated.insertedId));

        const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "120ms",
          }
        );

        return server_response(200, res, "Created successfully!", {
          token,
          refresh_token: await refreshToken(user._id),
        });
      } else {
        return server_response(
          500,
          res,
          "Unexpected error occurred, user not created!"
        );
      }
    }

    res.send({ error: result.array() });
  }
);

module.exports = router;
