const {
  generateRefreshToken,
  getRefreshToken,
  updateRefreshToken,
} = require("../../config/factory/refresh_token_factory");
const { v7: uuidv7 } = require("uuid");
const bcrypt = require("bcrypt");

async function refreshToken(userId) {
  try {
    const refreshToken = await getRefreshToken(userId);
    console.log("refreshing...", refreshToken);

    const refresh_token_hash = uuidv7();

    if (refreshToken) {
      const { acknowledged } = await updateRefreshToken(
        userId,
        refresh_token_hash
      );
      return acknowledged & (await getRefreshToken(userId).refresh_token);
    } else {
      const generatedRefreshToken = await generateRefreshToken(
        refresh_token_hash,
        userId
      );
      const { refresh_token } = await getRefreshToken(
        generatedRefreshToken.insertedId
      );
      return refresh_token;
    }
  } catch {
    throw new Error("Error occurred while refreshing token");
  }
}

module.exports = { refreshToken };
