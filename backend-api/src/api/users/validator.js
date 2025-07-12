const Joi = require('joi');
const InvariantError = require('../../exceptions/InvariantError');

const UserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});

const UsersValidator = {
  validateUserPayload: (payload) => {
    const result = UserPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = UsersValidator;