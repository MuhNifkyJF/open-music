const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists/{id}/songs",
    handler: handler.postPlaylistsongHandler,
    options: {
      auth: "playlists_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists/{id}/songs",
    handler: handler.getplaylistsongsByIdHandler,
    options: {
      auth: "playlists_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}/songs",
    handler: handler.deletePlaylistsongByIdHandler,
    options: {
      auth: "playlists_jwt",
    },
  },
];

module.exports = routes;
