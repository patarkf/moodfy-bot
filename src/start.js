

const mongoose = require('mongoose');
const {mongodb} = require('../config');

mongoose.connect(mongodb.databaseUrl, {
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
  useNewUrlParser: true,
});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(err.message);
});
require('./models/Track');

const app = require('./app');

app();
