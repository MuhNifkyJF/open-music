const autoBind = require("auto-bind");

class ExportsHandler {
  constructor(service, playlistsongService, playlistService, exportsValidator) {
    this._service = service;
    this._playlistsongService = playlistsongService;
    this._playlistService = playlistService;
    this._validator = exportsValidator;

    autoBind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportPlaylistsPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { targetEmail } = request.payload;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    const playlist = await this._playlistsongService.getPlaylistsongs(
      playlistId
    );
    const message = {
      playlist,
      targetEmail,
    };

    await this._service.sendMessage(
      "export:playlists",
      JSON.stringify(message)
    );

    const response = h.response({
      status: "success",
      message: "Permintaan Anda sedang kami proses",
    });
    response.code(201);
    return response;
  }
}
module.exports = ExportsHandler;
