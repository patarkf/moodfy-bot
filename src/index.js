'use restrict';

/**
 * Node modules
 */
const SpotifyWebApi = require('spotify-web-api-node');
const mongoose = require('mongoose');

/**
 * Local modules
 */
const {
  clientId, clientSecret, playlistId, username,
} = require('../config/credentials');
const {databaseUrl} = require('../config/database');

mongoose.connect(databaseUrl, {
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

const Track = mongoose.model('Track');

const options = {
  clientId,
  clientSecret,
};

const spotifyApi = new SpotifyWebApi(options);

/**
 * Retrieves the client's credentials and token and use
 * it to authenticate requests.
 *
 * @returns void
 */
const setSpotifyToken = async () => {
  const token = await spotifyApi.clientCredentialsGrant();

  console.log(`The access token expires in ${token.body.expires_in}`);
  console.log(`The access token is ${token.body.access_token}`);

  spotifyApi.setAccessToken(token.body.access_token);
};

/**
 * Shuffles an given array.
 *
 * @param {Array} arr
 * @returns {Array}
 */
const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);

/**
 * Executes steps to retrieve tracks of a given playlist and shuffle
 * this list to extract a random track from it.
 *
 * @returns void
 */
const init = async () => {
  await setSpotifyToken();

  const data = await spotifyApi.getPlaylistTracks(username, playlistId, {
    offset: 1,
    limit: 100,
    fields: 'items',
  });

  const alreadyPostedTracks = await Track.find({}).select('spotifyId');
  const alreadyPostedTracksIds = alreadyPostedTracks.map(track => track.spotifyId);

  const tracks = data.body.items.map(item => item.track);

  const availableForPostingTracks = tracks.filter(track => !alreadyPostedTracksIds.includes(track.id));
  if (!availableForPostingTracks.length) {
    console.log('There is no available tracks for posting at this moment. :(');
    return false;
  }

  const randomTrack = shuffleArray(availableForPostingTracks).shift();

  await Track.create({
    name: randomTrack.name,
    spotifyId: randomTrack.id,
    spotifyExternalUrl: randomTrack.external_urls.spotify,
  });

  console.log(`Just posted: ${randomTrack.name}. Give it a listen. :)`);

  return true;
};

init();
