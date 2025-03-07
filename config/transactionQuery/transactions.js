const { client } = require("../connectDB/connectdb");
const { topUpDB } = require("../topUpQuery/topup");
const db = client.db("digit_data_db");
const collection = db.collection("transactions");

async function createTransaction(transaction) {
  try {
    return await collection.insertOne(transaction);
  } catch {
    throw new Error("Unexpected occurred creating transaction");
  }
}

async function getTransactionsById(id) {
  try {
    return await collection.find({ userId: id }).toArray();
  } catch {
    throw new Error("Unexpected occurred getting transactions");
  }
}

module.exports = { createTransaction, getTransactionsById };
