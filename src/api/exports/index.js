const ExportsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "exports",
  version: "1.0.0",
  register: async (
    server,
    { service, playlistsongService, playlistService, validator }
  ) => {
    const exportsHandler = new ExportsHandler(
      service,
      playlistsongService,
      playlistService,
      validator
    );
    server.route(routes(exportsHandler));
  },
};
