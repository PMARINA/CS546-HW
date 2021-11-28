const mongoose = require("mongoose");
const config = require("../config.json");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

const User = mongoose.model(config.DATABASE.collection.users, userSchema);

module.exports = User;
