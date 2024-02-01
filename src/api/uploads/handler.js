
class UploadsHandler {
  constructor(service, albumService, validator) {
    this._service = service;
    this._albumService = albumService;
    this._validator = validator;
    this.postUploadCoverHandler = this.postUploadCoverHandler.bind(this);
  }
  async postUploadCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;
    this._validator.validateCoverHeaders(cover.hapi.headers);

    const filename = await this._service.writeFile(cover, cover.hapi);
    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
    await this._albumService.addAlbumCover(coverUrl, id);

    const response = h.response({
      status: "success",
      message: "Sampul berhasil diunggah",
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
