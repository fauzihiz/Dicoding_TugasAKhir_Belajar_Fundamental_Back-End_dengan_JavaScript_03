const Joi = require('joi');
const InvariantError = require('../../exceptions/InvariantError');

const CollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

const CollaborationsValidator = {
  validateCollaborationPayload: (payload) => {
    const result = CollaborationPayloadSchema.validate(payload);
    if (result.error) throw new InvariantError(result.error.message);
  },
};

module.exports = CollaborationsValidator;