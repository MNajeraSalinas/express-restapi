const { MongoClient } = require('mongodb');
const connectionString = process.env.ATLAS_URI;
const client = new MongoClient(connectionString);

let connection;

module.exports = {
  connectToServer: function (callback) {
    client
      .connect()
      .then((_connection) => {
        connection = _connection;
        callback();
      })
      .catch(callback);
  },

  getDb: function (dbName) {
    const db = connection.db(dbName);
    // console.log('GETTING DB', dbName, typeof db);
    return db;
  },
};
