const mongoose = require('mongoose');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const trackSchema = new Schema({
  name: String,
  spotifyId: String,
  spotifyExternalUrl: String,
  createdAt: { type: Date, default: Date.now },
});

trackSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Track', trackSchema);
