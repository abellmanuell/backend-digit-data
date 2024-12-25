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
      updated_at: d,
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
    const token = await refreshTokenCollection.findOne({
      $or: [{ _id: token_Id }, { refresh_token: token_Id }],
    });
    console.log(token);
    return token;
  } catch (e) {
    console.error(e);
  }
}

function updateRefreshToken(oldToken, newToken) {
  try {
    const d = new Date();
    const refresh_token = refreshTokenCollection.updateOne(
      { $or: [{ userId: oldToken }, { refresh_token: oldToken }] },
      {
        $set: {
          refresh_token: newToken,
          updated_at: d,
        },
      }
    );

    console.log(refresh_token);
    return refresh_token;
  } catch (e) {
    console.error(e);
  }
}

module.exports = { generateRefreshToken, getRefreshToken, updateRefreshToken };
