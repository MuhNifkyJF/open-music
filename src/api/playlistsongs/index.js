const PlaylistsongHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "playlistsongs",
  version: "1.0.0",
  register: async (server, { playlistsongService, playlistService, validator }) => {
    const playlistsongHandler = new PlaylistsongHandler(
      playlistsongService,
      playlistService,
      validator
    );

    server.route(routes(playlistsongHandler));
  },
};


