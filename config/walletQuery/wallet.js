const { client } = require("../connectDB/connectdb");
const { topUpDB } = require("../topUpQuery/topup");
const db = client.db("digit_data_db");
const userCollection = db.collection("users");
const userAccountTransactions = db.collection("user_account_transactions");

/* Record transactions */
async function createUserAccountTransaction(transactions) {
  try {
    return await userAccountTransactions.insertOne(transactions);
  } catch {
    throw new Error("Unexpected occurred create transaction event");
  }
}

/* Find recorded transaction by ID */
async function findUserAccountTransactionById(eventId) {
  try {
    return await userAccountTransactions.findOne({
      $or: [{ eventId }, { tx_rf: eventId }],
    });
  } catch {
    throw new Error("Unexpected occurred finding user account transaction");
  }
}

/*Deduct fund from user account */
async function deductFund(amount, userId) {
  try {
    const wallet_balance = await topUpDB(userId);
    const deducted = wallet_balance[0].wallet_balance - parseInt(amount);

    return await userCollection.updateOne(
      { _id: userId },
      { $set: { wallet_balance: deducted } }
    );
  } catch {
    throw new Error("Unexpected occurred deducting amount");
  }
}

/* Add fund to user account */
async function addFund(amount, email) {
  try {
    const wallet_balance = await topUpDB(email);
    const add = wallet_balance[0].wallet_balance + amount;

    return await userCollection.updateOne(
      { email },
      { $set: { wallet_balance: add } }
    );
  } catch {
    throw new Error("Unexpected occurred funding");
  }
}

module.exports = {
  deductFund,
  addFund,
  findUserAccountTransactionById,
  createUserAccountTransaction,
};
