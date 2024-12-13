const {generateRefreshToken, getToken} = require("../../config/refreshToken/refresh_token");
const {v7: uuidv7} = require("uuid");
const bcrypt = require('bcrypt')

async function refreshToken(){
    const refresh_token_hash = await bcrypt.hash(uuidv7(), 13);
    const generatedRefreshToken = await generateRefreshToken(refresh_token_hash)
     const {refresh_token, ...others} = await getToken(generatedRefreshToken.insertedId)
    return refresh_token;
}


module.exports = {refreshToken}