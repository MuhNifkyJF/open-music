const routes = (handler) => [
  {
    method: "POST",
    path: "/albums/{id}/likes",
    handler: handler.postAlbumlikesHandler,
    options: {
        auth: "playlists_jwt",
      },
  },
  {
    method: "DELETE",
    path: "/albums/{id}/likes",
    handler: handler.deleteAlbumlikesHandler,
    options: {
        auth: "playlists_jwt",
      },
  },
  {
    method: "GET",
    path: "/albums/{id}/likes",
    handler: handler.getAlbumlikesHandler,
    // options: {
    //     auth: "playlists_jwt",
    //   },
  },
];
module.exports = routes;
