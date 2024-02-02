const autoBind = require("auto-bind");

class AlbumlikesHandler {
  constructor(service, albumsService) {
    this._service = service;
    this._albumsService = albumsService;

    autoBind(this);
  }

  async postAlbumlikesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._albumsService.getAlbumById(albumId);
    await this._service.verifyAlbumlikes(credentialId, albumId);
    await this._service.addAlbumlikes(credentialId, albumId);

    const response = h.response({
      status: "success",
      message: "Berhasil menyukai album",
    });
    response.code(201);
    return response;
  }

  async deleteAlbumlikesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._albumsService.getAlbumById(albumId);
    await this._service.deleteAlbumlikes(credentialId, albumId);
    const response = h.response({
      status: "success",
      message: "Batal menyukai album",
    });
    response.code(200);
    return response;
  }
  async getAlbumlikesHandler(request, h) {
    const { id: albumId } = request.params;

    const number = await this._service.getAlbumlikes(albumId);
    const response = h.response({
      status: "success",
      data: {
        likes: number.likes,
      },
    });
    response.code(200);
    response.header("X-Data-Source", number.source);
    return response;
  }
}

module.exports = AlbumlikesHandler;
