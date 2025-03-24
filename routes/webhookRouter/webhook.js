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
  console.log("Request received...");

  // Validate Flutterwave Signature
  const secretHash = process.env.FLW_SECRET_HASH;
  const signature = req.headers["verif-hash"];
  if (!signature || signature !== secretHash) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  /* Extract Payload */
  const { data } = req.body;
  if (!data || !data.id || !data.amount || !data.customer) {
    return res.status(400).json({ message: "Invalid webhook payload" });
  }

  const { id, amount, customer } = data;
  console.log(`Processing transaction: ${id} for ${customer.email}`);

  /* Flutterwave Auth */
  const flw = new Flutterwave(
    process.env.FLW_PUBLIC_KEY,
    process.env.FLW_SECRET_KEY
  );

  try {
    // Verify transaction from Flutterwave API
    const response = await flw.Transaction.verify({ id });

    if (
      response.data.status === "successful" &&
      response.data.currency === "NGN"
    ) {
      // **Start Idempotency Check**
      const existingEvent = await findUserAccountTransactionById(id);

      if (existingEvent) {
        console.log(`Transaction ${id} already processed, ignoring...`);
        return res.status(200).json({ message: "Already processed" });
      }

      // **Save transaction first to prevent duplicate processing**
      await createUserAccountTransaction(req.body);

      // **Now, update user balance**
      // Substract Transaction Fee [NGN40] from amount
      await addFund(parseInt(amount) - 40, customer.email);

      console.log(`Transaction ${id} successfully processed.`);
      return res.status(200).json({ message: "Success" });
    } else {
      console.warn(`Transaction ${id} was unsuccessful.`);
      return res.status(400).json({ message: "Unsuccessful transaction" });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
