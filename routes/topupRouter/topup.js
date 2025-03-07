const express = require("express");
const { topUpDB } = require("../../config/topUpQuery/topup");
const { server_response } = require("../../utils/server_response");
const { default: fetcher } = require("../../utils/fetcher");
const { deductFund } = require("../../config/walletQuery/wallet");
const {
  createTransaction,
} = require("../../config/transactionQuery/transactions");
const { findUserById } = require("../../config/userQuery/userdb");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const userId = req.user.userId;
    const data = req.body;
    const wallet_balance = await topUpDB(userId);
    if (
      wallet_balance[0].wallet_balance < 100 ||
      parseInt(data.amount) > wallet_balance[0].wallet_balance
    ) {
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
    } else if (parseInt(data.amount) <= 0) {
      return server_response(
        400,
        res,
        `You enter an invalid amount ${data.amount}`,
        {
          data: {
            _id: wallet_balance[0]._id,
            wallet_balance: wallet_balance[0].wallet_balance,
          },
        }
      );
    } else {
      const request = await fetcher.post("/topup/", {
        ...data,
        Ported_number: true,
      });

      if (request?.error) {
        // Message Super Administrator to top central account
        console.log(
          request,
          "\n",
          ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n",
          "Message Super Administrator to topup central account.",
          "\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
        );
        return server_response(
          500,
          res,
          `Please contact Admin to activate your bonus!`
        );
      }

      await deductFund(data.amount, userId);
      const user = await findUserById(userId);
      await createTransaction({ ...request, userId });
      return server_response(200, res, `Successfully topup ₦${data.amount}!`, {
        data: user,
      });
    }
  } catch {
    throw new Error("Unexpected occurred while topping-up!");
  }
});

module.exports = router;
