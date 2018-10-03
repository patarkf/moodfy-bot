require('dotenv').config();

module.exports = {
  spotify: {
    credentials: {
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    },
    user: {
      playlistId: process.env.PLAYLIST_ID,
      username: process.env.USERNAME,
    },
  },
  mongodb: {
    databaseUrl: process.env.MONGODB_URL,
  },
};
