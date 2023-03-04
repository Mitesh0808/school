const Joi = require("joi");
//school,isActive,fullName,email,phoneNo

let loginValidator = Joi.object({
  email: Joi.string().email().required().messages(),
  password: Joi.string().required().messages(),
});
const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

module.exports = validator(loginValidator);
