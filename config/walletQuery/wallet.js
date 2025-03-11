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

async function addFund(amount, email) {
  try {
    const wallet_balance = await topUpDB(email);
    console.log(wallet_balance);
    const add = wallet_balance[0].wallet_balance + parseInt(amount);

    return await collection.updateOne(
      { email },
      { $set: { wallet_balance: add } }
    );
  } catch {
    throw new Error("Unexpected occurred funding");
  }
}

module.exports = { deductFund, addFund };
