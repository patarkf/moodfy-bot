'use restrict';

const SpotifyWebApi = require('spotify-web-api-node');
const mongoose = require('mongoose');

const { spotify } = require('../config');

const Track = mongoose.model('Track');

const spotifyApi = new SpotifyWebApi(spotify.credentials);

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

  const { user: { username, playlistId } } = spotify;
  const result = await spotifyApi.getPlaylistTracks(username, playlistId, {
    offset: 1,
    limit: 100,
    fields: 'items',
  });

  const oldTracks = await Track.find({}).select('spotifyId');
  const oldTracksIds = oldTracks.map(track => track.spotifyId);

  const tracks = result.body.items.map(item => item.track);

  const availableForPostingTracks = tracks.filter(track => !oldTracksIds.includes(track.id));
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

module.exports = init;
