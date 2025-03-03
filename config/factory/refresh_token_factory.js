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

async function getRefreshToken(userToken) {
  try {
    const token = await refreshTokenCollection.findOne({
      $or: [{ userId: userToken }, { refresh_token: userToken }],
    });
    return token;
  } catch (e) {
    console.error(e);
  }
}

async function updateRefreshToken(oldToken, newToken) {
  try {
    const d = new Date();
    const refresh_token = await refreshTokenCollection.updateOne(
      { $or: [{ userId: oldToken }, { refresh_token: oldToken }] },
      {
        $set: {
          refresh_token: newToken,
          updated_at: d,
        },
      }
    );

    return refresh_token;
  } catch (e) {
    console.error(e);
  }
}

module.exports = { generateRefreshToken, getRefreshToken, updateRefreshToken };
