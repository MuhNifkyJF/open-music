const ClientError = require("../../exception/ClientError");
class PlaylistsongHandler {
  constructor(playlistsongService, playlistService, validator) {
    this._playlistsongService = playlistsongService;
    this._playlistService = playlistService;
    this._validator = validator;

    this.postPlaylistsongHandler = this.postPlaylistsongHandler.bind(this);
    this.getplaylistsongsByIdHandler =
      this.getplaylistsongsByIdHandler.bind(this);
    this.deletePlaylistsongByIdHandler =
      this.deletePlaylistsongByIdHandler.bind(this);
  }

  async postPlaylistsongHandler(request, h) {
    try {
      this._validator.validatePlaylistsongPayload(request.payload);
      const { songId } = request.payload;
      const { id: playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      

      await this._playlistService.verifyPlaylistOwner(
        playlistId,
        credentialId
      );
      await this._playlistsongService.addPlaylistsong(playlistId,songId);

      const response = h.response({
        status: "success",
        message: "Lagu berhasil ditambahkan didalam playlist",
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getplaylistsongsByIdHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id: playlistId } = request.params;

      await this._playlistService.verifyPlaylistOwner(
        playlistId,
        credentialId
      );

      const playlistsongs = await this._playlistsongService.getPlaylistsongs(
        playlistId
      );
      return {
        status: "success",
        data: {
          playlist: playlistsongs,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deletePlaylistsongByIdHandler(request, h) {
    try {
      this._validator.validatePlaylistsongPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { songId } = request.payload;
      const { id: playlistId } = request.params;

      await this._playlistService.verifyPlaylistOwner(
        playlistId,
        credentialId
      );
      await this._playlistsongService.deletePlaylistsong(songId, playlistId);

      return {
        status: "success",
        message: "Lagu berhasil dihapus didalam playlist",
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = PlaylistsongHandler;
