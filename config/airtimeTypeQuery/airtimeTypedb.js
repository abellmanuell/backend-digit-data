const { client } = require("../connectDB/connectdb");
const db = client.db("digit_data_db");
const collection = db.collection("airtime_type");

async function findAirtimeType() {
  try {
    const airtimeType = await collection.find().toArray();
    return airtimeType;
  } catch {
    throw new Error();
  }
}

module.exports = { findAirtimeType };
