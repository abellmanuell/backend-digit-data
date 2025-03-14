const { client } = require("../connectDB/connectdb");
const { v7: uuidv7 } = require("uuid");
const db = client.db("digit_data_db");
const collection = db.collection("users");

async function findUsers(data) {
  try {
    const users = await collection
      .find({ email: data ?? data.email })
      .toArray();
    return users;
  } catch (e) {
    console.error(e);
  }
}

async function findUser(data) {
  try {
    const user = await collection.findOne({
      $or: [{ email: data }, { email: data.email }],
    });
    return user;
  } catch (e) {
    console.error(e);
  }
}

async function findUserById(id) {
  try {
    const user = await collection.findOne({
      $or: [{ _id: id }, { google_id: id }],
    });
    return user;
  } catch (e) {
    console.error(e);
  }
}

async function createUser(data) {
  try {
    const d = new Date();
    const user = await collection.insertOne({
      ...data,
      _id: uuidv7(),
      email: data.email,
      password: data.password,
      created_at: d,
      updated_at: d,
      wallet_balance: 0,
      pin: null,
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
      { $or: [{ _id: id }, { email: data.email }] },
      { $set: { ...data, updated_at: d } }
    );

    console.log(await updateUser);
    return await updatedUser;
  } catch (e) {
    console.error(e);
  }
}

module.exports = { findUsers, findUser, createUser, findUserById, updateUser };
