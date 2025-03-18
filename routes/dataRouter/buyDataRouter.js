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
      parseInt(data.plan_amount) > wallet_balance[0].wallet_balance
    ) {
      return server_response(
        400,
        res,
        `You can't buy data due to insufficient balance ₦${wallet_balance[0].wallet_balance}`,
        {
          data: {
            _id: wallet_balance[0]._id,
            wallet_balance: wallet_balance[0].wallet_balance,
          },
        }
      );
    } else if (parseInt(data.plan_amount) <= 0) {
      return server_response(
        400,
        res,
        `You enter an invalid amount ${data.plan_amount}`,
        {
          data: {
            _id: wallet_balance[0]._id,
            wallet_balance: wallet_balance[0].wallet_balance,
          },
        }
      );
    } else {
      const request = await fetcher.post("/data/", {
        network: data.network,
        mobile_number: data.mobile_number,
        plan: data.dataplan_id,
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

      await deductFund(data.plan_amount, userId);
      const user = await findUserById(userId);
      await createTransaction({ ...request, userId });
      return server_response(
        200,
        res,
        `Successfully bought ${data.plan} for ${data.month_validate}!`,
        {
          data: user,
        }
      );
    }
  } catch {
    throw new Error("Unexpected occurred while buying data!");
  }
});

module.exports = router;
