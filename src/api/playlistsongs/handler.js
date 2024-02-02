const autoBind = require("auto-bind");

class PlaylistsongHandler {
  constructor(playlistsongService, playlistService, validator) {
    this._playlistsongService = playlistsongService;
    this._playlistService = playlistService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistsongHandler(request, h) {
    this._validator.validatePlaylistsongPayload(request.payload);
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistsongService.addPlaylistsong(playlistId, songId);

    const response = h.response({
      status: "success",
      message: "Lagu berhasil ditambahkan didalam playlist",
    });
    response.code(201);
    return response;
  }

  async getplaylistsongsByIdHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);

    const playlistsongs = await this._playlistsongService.getPlaylistsongs(
      playlistId
    );
    return {
      status: "success",
      data: {
        playlist: playlistsongs,
      },
    };
  }

  async deletePlaylistsongByIdHandler(request, h) {
    this._validator.validatePlaylistsongPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    const { id: playlistId } = request.params;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistsongService.deletePlaylistsong(songId, playlistId);

    return {
      status: "success",
      message: "Lagu berhasil dihapus didalam playlist",
    };
  }
}

module.exports = PlaylistsongHandler;
