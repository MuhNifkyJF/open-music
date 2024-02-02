const autoBind = require("auto-bind");

class PlaylistsHandler {
  constructor(playlistsService, validator) {
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlist_id = await this._playlistsService.addPlaylist({
      name,
      owner: credentialId,
    });

    const response = h.response({
      status: "success",
      message: "Playlist berhasil ditambahkan",
      data: {
        playlistId: playlist_id,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._playlistsService.getPlaylists(credentialId);

    if (playlists && playlists.playlist) {
      const response = h.response({
        status: "success",
        data: {
          playlists: playlists.playlist.map((row) => ({
            id: row.id,
            name: row.name,
            username: row.username,
          })),
        },
      });
      response.code(200);
      response.header("X-Data-Source", playlists.source);
      return response;
    } else {
      const response = h.response({
        status: "success",
        data: {
          playlists: [],
        },
      });
      response.code(200);
      response.header("X-Data-Source", "unknown");
      return response;
    }
  }

  async deletePlaylistByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(id, credentialId);
    await this._playlistsService.deletePlaylistById(id);
    return {
      status: "success",
      message: "Playlist berhasil dihapus",
    };
  }
}

module.exports = PlaylistsHandler;
