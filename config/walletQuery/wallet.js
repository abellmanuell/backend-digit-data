const { client } = require("../connectDB/connectdb");
const { topUpDB } = require("../topUpQuery/topup");
const db = client.db("digit_data_db");
const collection = db.collection("users");

async function deductFund(amount, userId) {
  try {
    const wallet_balance = await topUpDB(userId);
    const deducted = wallet_balance[0].wallet_balance - parseInt(amount);

    return await collection.updateOne(
      { _id: userId },
      { $set: { wallet_balance: deducted } }
    );
  } catch {
    throw new Error("Unexpected occurred deducting amount");
  }
}

module.exports = { deductFund };
