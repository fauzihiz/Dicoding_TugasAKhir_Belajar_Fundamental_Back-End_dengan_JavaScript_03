const { extname } = require('path');

class UploadsHandler {
  constructor(service, albumsService, validator) {
    this._service = service;
    this._albumsService = albumsService;
    this._validator = validator;

    this.postUploadCoverHandler = this.postUploadCoverHandler.bind(this);
  }

  async postUploadCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id: albumId } = request.params;

    const filename = await this._service.writeFile(cover, cover.hapi);

    // Validasi MIME type
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(cover.hapi.headers['content-type'])) {
      const fs = require('fs');
      const path = require('path');
      // Hapus file yang terlanjur tersimpan
      fs.unlinkSync(path.resolve(__dirname, `../../uploads/images/${filename}`));

      const response = h.response({
        status: 'fail',
        message: 'Format file tidak didukung. Hanya gambar yang diperbolehkan.',
      });
      response.code(400);
      return response;
    }

    const fileUrl = `http://${request.headers.host}/albums/covers/${filename}`;
    await this._albumsService.updateCoverUrl(albumId, fileUrl);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;