/* eslint-disable require-jsdoc */
const MongoClient = require('mongodb').MongoClient;
const settings = require('./settings');
const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;
let connectionCount = 0;


async function getDb() {
  if (!_connection && connectionCount === 0) {
    connectionCount += 1;
    _connection = await MongoClient.connect(mongoConfig.serverUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (!_db) {
      _db = await _connection.db(mongoConfig.database);
    }
  }
  return _db;
};

async function getClient() {
  if (!_connection && connectionCount === 0) {
    connectionCount += 1;
    _connection = await MongoClient.connect(mongoConfig.serverUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } else if (!_connection) {

  }
  return _connection;
}

module.exports = {getDb, getClient};
