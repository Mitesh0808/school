const Joi = require("joi");
//isActive,email,schoolName,phoneNo

let schoolCreateValidator = Joi.object({
  isActive: Joi.boolean().default(true),
  email: Joi.string()
    .email({ tlds: { allow: true } })
    .required(),
  schoolName: Joi.string().trim().max(255).required(),
  phoneNo: Joi.string()
    .trim()
    .pattern(
      /^(\+\d{1,2}[-\s]?)?(\d{3}[-\s]?\d{3}[-\s]?\d{4}|\(\d{3}\)\s*\d{3}[-\s]?\d{4}|\d{10})$/
    )
    .required(),
});

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });
schoolCreateValidator = validator(schoolCreateValidator);

let schoolUpdateValidator = Joi.object({
  isActive: Joi.boolean().default(true).messages(),
  email: Joi.string()
    .email({ tlds: { allow: true } })
    .messages(),
  schoolName: Joi.string().trim().max(255).messages(),
  phoneNo: Joi.string()
    .trim()
    .pattern(
      /^(\+\d{1,2}[-\s]?)?(\d{3}[-\s]?\d{3}[-\s]?\d{4}|\(\d{3}\)\s*\d{3}[-\s]?\d{4}|\d{10})$/
    )
    .messages(),
});
schoolUpdateValidator = validator(schoolUpdateValidator);

module.exports = {
  schoolCreateValidator,
  schoolUpdateValidator,
};
