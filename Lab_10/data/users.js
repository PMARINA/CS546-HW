const User = require("../models/User");
const bcrypt = require("bcrypt");
const config = require("../config.json");

async function validateUsername(u, checkExistance = true) {
  if (typeof u !== "string") {
    throw new Error("Username must be a string");
  }
  u = u.trim().toLowerCase();
  if (u.length < 4) {
    throw new Error("Username is too short. Make it 4+ characters long");
  }
  const charCodeOfa = "a".charCodeAt(0);
  const charCodeOfz = "z".charCodeAt(0);
  const charCodeOf0 = "0".charCodeAt(0);
  const charCodeOf9 = "9".charCodeAt(0);
  for (let i = 0; i < u.length; i++) {
    const c = u.charCodeAt(i);
    if (c >= charCodeOfa && c <= charCodeOfz) {
      continue;
    }
    if (c >= charCodeOf0 && c <= charCodeOf9) {
      continue;
    }
    throw new Error("Username contains invalid characters (alphanumeric only)");
  }
  if (checkExistance && (await User.exists({ username: u })))
    throw new Error("User already exists with the given username");
  return u;
}

async function validateAndHashPassword(p, getHashedValue = true) {
  if (typeof p !== "string") throw new Error("Password must be a string");
  if (p.length < 6)
    throw new Error("Password must be at least 6 characters long");
  for (let i = 0; i < p.length; i++) {
    const c = p.charCodeAt(i);
    if (c === " ".charCodeAt(0)) {
      throw new Error("Password may not contain spaces");
    }
  }
  if (getHashedValue) return await bcrypt.hash(p, config.BCRYPT.numRounds);
  else return p;
}
async function createUser(username, password) {
  username = await validateUsername(username);
  hashPwd = await validateAndHashPassword(password, (getHashedValue = true));
  console.log("Creating user");
  await User.create({ username: username, password: hashPwd });
  return { userInserted: true };
}

async function checkUser(username, password) {
  const errString = "Either the username or password is invalid";
  username = await validateUsername(username, (checkExistance = false));
  password = await validateAndHashPassword(password, (getHashedValue = false));
  const userDoc = await User.findOne(
    { username: username },
    { _id: 0, password: 1 }
  ).exec();
  if (!userDoc) throw new Error(errString);
  hashedPwd = userDoc.password;
  if (await bcrypt.compare(password, hashedPwd)) {
    return { authenticated: true };
  }
  throw new Error(errString);
}

module.exports = {
  createUser,
  checkUser,
};
