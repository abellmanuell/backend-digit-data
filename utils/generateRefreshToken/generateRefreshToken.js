const {
  generateRefreshToken,
  getRefreshToken,
  updateRefreshToken,
} = require("../../config/factory/refresh_token_factory");
const { v7: uuidv7 } = require("uuid");

async function refreshToken(userId) {
  try {
    const refresh_token_hash = uuidv7();

    /* Check if refresh token exist before proceed */
    const refreshToken = await getRefreshToken(userId);

    /* Update refresh token if exist */
    if (refreshToken) {
      const { acknowledged } = await updateRefreshToken(
        userId,
        refresh_token_hash
      );
      if (acknowledged) {
        const { refresh_token } = await getRefreshToken(userId);
        return refresh_token;
      }
    } else {
      /* Generate fresh token */
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
