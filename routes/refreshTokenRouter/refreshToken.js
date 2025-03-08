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
const { jwtDecode } = require("../../utils/JwtVerify/jwtVerify");

router.post(
  "/",
  body("refresh_token").notEmpty().escape(),
  async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const { refresh_token: id } = matchedData(req);

      /* Check if token exist */
      const { decodeToken, isExpired } = await jwtDecode(req);
      const rt = await getRefreshToken(id);

      if (!rt) {
        return server_response(404, res, "Refresh token not found");
      }

      /* Execute if token expired */
      if (isExpired) {
        const userId = rt.userId;
        const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
          expiresIn: "1h",
        });

        return server_response(200, res, "Token Successfully renewed!", {
          // token,
          refresh_token: await refreshToken(userId),
        });
      } else {
        return server_response(200, res, "Token still valid!", {
          // token: decodeToken,
          refresh_token: id,
        });
      }
    }
  }
);

module.exports = router;
