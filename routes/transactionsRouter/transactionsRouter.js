const express = require("express");
const { server_response } = require("../../utils/server_response");
const {
  getTransactionsById,
} = require("../../config/transactionQuery/transactions");
const router = express.Router();

router.use("/:id", async (req, res) => {
  try {
    const id = req.params["id"];

    const transactions = await getTransactionsById(id);
    return server_response(200, res, "Successfully completed", {
      data: transactions,
    });
  } catch {
    throw new Error("Unexpected error occurred");
  }
});

module.exports = router;
