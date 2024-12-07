const {client} = require('../connectDB/connectdb')
const {v7: uuidv7} = require("uuid");
const db = client.db('digit_data_db');
const collection = db.collection("refresh_tokens")

async function generateRefreshToken(token){
    try {
        const d = new Date();
        const refresh_token = await collection.insertOne(
            {_id: uuidv7(), created_at: d, refresh_token: token});
        return refresh_token;
    }catch (e) {
        console.error(e)
    }
}

async function getToken(token_Id){
    try {
        const token = await collection.findOne({_id: token_Id})
        return token
    }catch (e) {
        console.error(e)
    }
}
module.exports = {generateRefreshToken, getToken}