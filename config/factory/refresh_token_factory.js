const { client } = require("../connectDB/connectdb");
const { v7: uuidv7 } = require("uuid");
const db = client.db("digit_data_db");
const refreshTokenCollection = db.collection("refresh_tokens");

async function generateRefreshToken(token, userId) {
  try {
    const d = new Date();
    const refresh_token = await refreshTokenCollection.insertOne({
      _id: uuidv7(),
      created_at: d,
      refresh_token: token,
      userId,
    });
    return refresh_token;
  } catch (e) {
    console.error(e);
  }
}

async function getRefreshToken(token_Id) {
  try {
    const token = await refreshTokenCollection.findOne({ $or:[{_id: token_Id}, {refresh_token: token_Id}] });
    return token;
  } catch (e) {
    console.error(e);
  }
}
function updateRefreshToken(token, userId) {
  try {
    const d = new Date();
    const refresh_token = refreshTokenCollection.updateOne(
      { userId },
      {
        $set: {
          refresh_token: token,
          created_at: d,
        },
      }
    );
    return refresh_token;
  } catch (e) {
    console.error(e);
  }
}

module.exports = { generateRefreshToken, getRefreshToken, updateRefreshToken };
