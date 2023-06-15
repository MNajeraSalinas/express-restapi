const { MongoClient, Db } = require('mongodb');

const DB_NAME = 'sample_training';

const connectionString = process.env.ATLAS_URI;
const client = new MongoClient(connectionString);

let db = null;

/**
 *
 * @param {(error?) => void} callback
 */
async function connectToServer(callback) {
  try {
    const connection = await client.connect();
    db = connection.db(DB_NAME);
    callback();
  } catch (e) {
    callback(e);
  }
}

/**
 *
 * @returns {Promise<Db>} Db instance
 */
async function getDb() {
  if (db === null) {
    await connectToServer(function () {});
  }
  return db;
}

module.exports = {
  connectToServer,
  getDb,
};
