const AlbumlikesHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "albumlikes",
  version: "1.0.0",
  register: async (server, { service, albumsService }) => {
    const albumlikesHandler = new AlbumlikesHandler(service, albumsService);

    server.route(routes(albumlikesHandler));
  },
};
