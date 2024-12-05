const {MongoClient} = require('mongodb')
require('dotenv').config();

const client = new MongoClient(process.env.DB_CONNECTION_URL);

async function connectDB(){
    await client.connect();
    console.log("Database successfully connected!");
}

module.exports = { client, connectDB}