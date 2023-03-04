const Joi = require("joi");
//isActive,email,school

let financeCreateValidator = Joi.object({
  isActive: Joi.boolean().default(true).messages(),
  email: Joi.string().email().required().messages(),
  school: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages(),
});
const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });
financeCreateValidator = validator(financeCreateValidator);

let financeUpdateValidator = Joi.object({
  isActive: Joi.boolean().messages(),
  email: Joi.string().email().messages(),
  school: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages(),
});
financeUpdateValidator = validator(financeUpdateValidator);
module.exports = {
  financeCreateValidator,
  financeUpdateValidator,
};
