const {generateRefreshToken, getToken} = require("../../config/refreshToken/refresh_token");
const {v7: uuidv7} = require("uuid");

async function refreshToken(){
    const generatedRefreshToken = await generateRefreshToken(uuidv7())
     const {refresh_token, ...others} = await getToken(generatedRefreshToken.insertedId)
    return refresh_token;
}


module.exports = {refreshToken}