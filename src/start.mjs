import mongoose from 'mongoose';
import config from '../config/index.mjs';

const { mongodb } = config;

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
import './models/Track';
import app from './app';

app();
