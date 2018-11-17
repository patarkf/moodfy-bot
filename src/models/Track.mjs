import mongoose from 'mongoose';

const { Schema } = mongoose;
mongoose.Promise = global.Promise;
import mongodbErrorHandler from 'mongoose-mongodb-errors';

const trackSchema = new Schema({
  name: String,
  spotifyId: String,
  spotifyExternalUrl: String,
  createdAt: { type: Date, default: Date.now },
});

trackSchema.plugin(mongodbErrorHandler);

export default mongoose.model('Track', trackSchema);
