'use restrict';

const SpotifyWebApi = require('spotify-web-api-node');
const {
  clientId,
  clientSecret,
  playlistId,
  username,
} = require('./config');

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
 */
const init = async () => {
  await setSpotifyToken();

  const data = await spotifyApi.getPlaylistTracks(username, playlistId, {
    offset: 1,
    limit: 100,
    fields: 'items',
  });

  const tracksExternalUrls = shuffleArray(data.body.items.map(item => item.track.external_urls.spotify));

  const randomTrack = tracksExternalUrls.shift();
  console.log(randomTrack);
};

init();
