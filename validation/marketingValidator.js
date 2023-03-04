const Joi = require("joi");

//isActive,email,school

let marketingCreateValidator = Joi.object({
  isActive: Joi.boolean().default(true).messages(),
  school: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages(),
  email: Joi.string().email().required().messages(),
});
const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });
marketingCreateValidator = validator(marketingCreateValidator);
let marketingUpdateValidator = Joi.object({
  isActive: Joi.boolean().default(true).messages(),
  school: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages(),
  email: Joi.string().email().messages(),
});
marketingUpdateValidator = validator(marketingUpdateValidator);
module.exports = {
  marketingCreateValidator,
  marketingUpdateValidator,
};
