const Joi = require('joi');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistPayloadSchema = Joi.object({
  targetEmail: Joi.string().email().required(),
});

const ExportsValidator = {
  validateExportPlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ExportsValidator;