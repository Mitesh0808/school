const Joi = require("joi");

let idValidator = Joi.object({
  id: Joi.string().messages(),
  // .pattern(/^[0-9a-fA-F]{24}$/)
  // .required(),
});
const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

let loginValidator = Joi.object({
  email: Joi.string().email().required().messages(),
  password: Joi.string().required().messages(),
});
let emailValidator = Joi.object({
  email: Joi.string().email().required().messages(),
});
emailValidator = validator(emailValidator);

loginValidator = validator(loginValidator);

idValidator = validator(idValidator);
module.exports = {
  loginValidator,
  idValidator,
  emailValidator,
};
