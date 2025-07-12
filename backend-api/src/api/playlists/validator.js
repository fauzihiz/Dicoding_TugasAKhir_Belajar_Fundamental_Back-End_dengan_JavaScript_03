const Joi = require('joi');
const InvariantError = require('../../exceptions/InvariantError');

// Untuk CREATE playlist
const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

// Untuk ADD song to playlist
const PlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const result = PlaylistPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
  validatePlaylistSongPayload: (payload) => {
    const result = PlaylistSongPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  }
};

module.exports = PlaylistsValidator;