const express = require("express");
const router = express.Router();
require("dotenv").config();
const { server_response } = require("../../utils/server_response");
const { addFund } = require("../../config/walletQuery/wallet");

/* Webhook endpoint */
router.post("/", async (req, res) => {
  // If you specified a secret hash, check for the signature
  const secretHash = process.env.FLW_SECRET_HASH;
  const signature = req.headers["verif-hash"];
  if (!signature || signature !== secretHash) {
    // This request isn't from Flutterwave; discard
    res.status(401).end();
  }

  const payload = req.body;

  const existingEvent = payload.data.status;

  if (existingEvent.status === payload.status) {
    // The status hasn't changed,
    // so it's probably just a duplicate event
    // and we can discard it
    if (payload.data.status === "successful") {
      // It's a good idea to log all received events.
      const { amount, customer } = payload;

      console.log(payload);
      await addFund(amount, customer.email);

      /* Add transaction hisroy later */

      res.status(200).end();
    }
  }
  // Do something (that doesn't take too long) with the payload
  res.status(200).end();
});

module.exports = router;
