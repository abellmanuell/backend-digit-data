const express = require("express");
const { body, validationResult, matchedData } = require("express-validator");
const router = express.Router();
require("dotenv").config();
const { server_response } = require("../../utils/server_response");
const { v7: uuidv7 } = require("uuid");

router.post(
  "/",
  [
    body("amount")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Your amount must be greater than or equal ₦100"),
    body("email")
      .trim()
      .notEmpty()
      .isEmail()
      .withMessage("Please kindly update email"),
    body("mobile_number")
      .isNumeric()
      .withMessage("Please kindly update mobile number"),
    body("given_name").trim(),
    body("family_name").trim(),
  ],
  async (req, res) => {
    try {
      const result = validationResult(req);

      if (result.isEmpty()) {
        const data = matchedData(req);
        const link = await getPaymentLink({
          ...data,
          redirect_url:
            process.env.ACCESS_CONTROL_ALLOW_ORIGIN + "/dashboard/success",
        });
        return server_response(200, res, link);
      } else {
        return server_response(406, res, { error: result.array() });
      }
    } catch {
      return server_response(406, res, "Unexpected occurred funding wallet");
    }
  }
);

async function getPaymentLink({
  amount,
  email,
  given_name,
  family_name,
  mobile_number,
  redirect_url,
}) {
  try {
    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: uuidv7(),
        amount,
        currency: "NGN",
        redirect_url,
        customer: {
          email,
          name: `${given_name} ${family_name}`,
          phonenumber: mobile_number,
        },
        customizations: {
          title: "Flutterwave Standard Payment",
        },
      }),
    });

    const link = await response.json();

    return link;
  } catch (err) {
    console.error(err.code);
    console.error(err.response.data);
  }
}

module.exports = router;
