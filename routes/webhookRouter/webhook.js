const express = require("express");
const router = express.Router();
const Flutterwave = require("flutterwave-node-v3");
require("dotenv").config();
const {
  addFund,
  createUserAccountTransaction,
  findUserAccountTransactionById,
} = require("../../config/walletQuery/wallet");

/* Webhook endpoint */
router.post("/", async (req, res) => {
  // If you specified a secret hash, check for the signature
  const secretHash = process.env.FLW_SECRET_HASH;
  const signature = req.headers["verif-hash"];

  if (!signature || signature !== secretHash) {
    // This request isn't from Flutterwave; discard
    res.status(401).end();
  }

  /* Payload */
  const {
    data: { id, amount, customer },
  } = req.body;

  /* Flutterwave Auth */
  const flw = new Flutterwave(
    process.env.FLW_PUBLIC_KEY,
    process.env.FLW_SECRET_KEY
  );

  // Verify transactions
  const response = await flw.Transaction.verify({ id });
  if (
    response.data.status === "successful" &&
    response.data.currency === "NGN"
  ) {
    // Success! Confirm the customer's payment
    // Check if event exists
    const existingEvent = await findUserAccountTransactionById(id);

    if (existingEvent) {
      return res.status(200).json({ message: "Already processed" });
    }

    // Update user balance
    await addFund(amount, customer.email);
    await createUserAccountTransaction(payload);
    return res.status(200).json({ message: "Success" });
  } else {
    // Inform the customer their payment was unsuccessful
    return res.status(300).json({ message: "unsuccessful" });
  }
});

module.exports = router;
