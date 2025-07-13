const Joi = require('joi');
const InvariantError = require('../../exceptions/InvariantError');

const UserPayloadSchema = Joi.object({
  username: Joi.string().max(50).required(), //Karena username menggunakan type data VARCHAR(50) di database, Maka kamu bisa gunakan method max untuk membatasi panjang maksimal dari string
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