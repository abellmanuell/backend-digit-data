const { client } = require("../connectDB/connectdb");
const { v7: uuidv7 } = require("uuid");
const db = client.db("digit_data_db");
const collection = db.collection("networks");

async function findNetworks() {
  try {
    const networks = await collection.find().toArray();
    return networks;
  } catch {
    throw new Error();
  }
}

module.exports = { findNetworks };
