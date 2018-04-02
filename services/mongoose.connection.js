const mongoose = require('mongoose');

mongoose.Promise = Promise;

const uri = `mongodb://localhost:27017/jirengu`;

const connection = mongoose.connect(uri,{
  useMongoClient: true
});

const db = mongoose.connection;

db.on('open', () => {
  console.log('db connected!');
});

db.on('error', (e) => {
  console.log(e);
});

module.exports = db;