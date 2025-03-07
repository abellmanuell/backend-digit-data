const { client } = require("../connectDB/connectdb");
const { v7: uuidv7 } = require("uuid");
const db = client.db("digit_data_db");
const collection = db.collection("users");

async function findUsers(data) {
  try {
    const users = await collection.find({ email: data.email }).toArray();
    return users;
  } catch (e) {
    console.error(e);
  }
}

async function findUser(data) {
  try {
    const user = await collection.findOne({ email: data.email });
    return user;
  } catch (e) {
    console.error(e);
  }
}

async function findUserById(id) {
  try {
    const user = await collection.findOne({ _id: id });
    return user;
  } catch (e) {
    console.error(e);
  }
}

async function createUser(data) {
  try {
    const d = new Date();
    const user = await collection.insertOne({
      _id: uuidv7(),
      email: data.email,
      password: data.password,
      given_name: "",
      family_name: "",
      created_at: d,
      updated_at: d,
      wallet_balance: 100,
      pin: null,
      phoneNumber: null,
    });
    return user;
  } catch (e) {
    console.error(e);
  }
}

async function updateUser(id, data) {
  try {
    const d = new Date();
    const updatedUser = await collection.updateOne(
      { _id: id },
      { $set: { ...data, updated_at: d } }
    );
    return updatedUser;
  } catch (e) {
    console.error(e);
  }
}

module.exports = { findUsers, findUser, createUser, findUserById, updateUser };
