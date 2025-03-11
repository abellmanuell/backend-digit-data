const { client } = require("../connectDB/connectdb");
const db = client.db("digit_data_db");
const collection = db.collection("users");

async function topUpDB(userId) {
  try {
    const wallet_balance = await collection
      .find({ or: [{ _id: userId }, { email: userId }] })
      .project({ wallet_balance: 1 })
      .toArray();
    return wallet_balance;
  } catch {
    throw new Error("Unexpected Occurred TOPUP");
  }
}

module.exports = { topUpDB };
