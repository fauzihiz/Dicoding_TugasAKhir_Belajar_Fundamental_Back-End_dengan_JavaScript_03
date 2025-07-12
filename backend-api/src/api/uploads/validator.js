const InvariantError = require('../../exceptions/InvariantError');

const UploadsValidator = {
  validateImageHeaders: (headers) => {
    const contentType = headers['content-type'];
    if (!['image/jpeg', 'image/png'].includes(contentType)) {
      throw new InvariantError('Berkas harus berupa gambar');
    }
  },
};

module.exports = UploadsValidator;