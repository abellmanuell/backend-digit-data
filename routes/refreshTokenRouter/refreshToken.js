const express = require("express");
const router = express.Router();
const { body, validationResult, matchedData } = require("express-validator");
const {
  getRefreshToken,
} = require("../../config/factory/refresh_token_factory");
const {
  refreshToken,
} = require("../../utils/generateRefreshToken/generateRefreshToken");
const { server_response } = require("../../utils/server_response");
const jwt = require("jsonwebtoken");

router.post(
  "/",
  body("refresh_token").notEmpty().escape(),
  async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const { refresh_token: id } = matchedData(req);

      const rt = await getRefreshToken(id);
      const userId = rt.userId;

      if (!rt) {
        return server_response(404, res, "Refresh token not found");
      }

      const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      });
      return server_response(200, res, "Successfully verified!", {
        token,
        refresh_token: await refreshToken(userId),
      });
    }
  }
);

module.exports = router;
