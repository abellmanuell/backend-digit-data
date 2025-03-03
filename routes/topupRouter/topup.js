const express = require("express");
const { topUpDb } = require("../../config/topupQuery/topup");
const { server_response } = require("../../utils/server_response");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const wallet_balance = await topUpDb(req.user.userId);

    if (!wallet_balance[0].wallet_balance) {
      return server_response(
        400,
        res,
        `You can't topup due to insufficient balance ₦${wallet_balance[0].wallet_balance}`,
        {
          data: {
            _id: wallet_balance[0]._id,
            wallet_balance: wallet_balance[0].wallet_balance,
          },
        }
      );
    }
  } catch {}
});

module.exports = router;
