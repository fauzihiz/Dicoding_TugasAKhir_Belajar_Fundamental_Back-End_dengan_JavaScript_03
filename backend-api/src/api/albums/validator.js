const Joi = require('joi');
const InvariantError = require('../../exceptions/InvariantError');

// Validasi payload saat tambah/edit album
const currentYear = new Date().getFullYear();
const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(currentYear)
    .required(),
});

// Validasi parameter ID album (misalnya: album-xxxxxxxxxxxxxxxx)
const AlbumIdParamSchema = Joi.object({
  id: Joi.string().pattern(/^album-\w{16}$/).required(),
});

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const result = AlbumPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },

  validateAlbumIdParam: (params) => {
    const result = AlbumIdParamSchema.validate(params);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = AlbumsValidator;