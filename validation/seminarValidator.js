//isActive,presenter,description,link,dateTime
const Joi = require("joi");

let seminarCreateValidator = Joi.object({
  isActive: Joi.boolean().default(true).messages(),
  presenter: Joi.string().max(50).required().messages(),
  description: Joi.string().max(255).required().messages(),
  dateTime: Joi.string().max(50).required().messages(),
  link: Joi.string().max(255).required().messages(),
});

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });
seminarCreateValidator = validator(seminarCreateValidator);

let seminarUpdateValidator = Joi.object({
  isActive: Joi.boolean().default(true).messages(),
  presenter: Joi.string().max(50).messages(),
  description: Joi.string().max(255).messages(),
  dateTime: Joi.string().max(50).messages(),
  link: Joi.string().max(255).messages(),
});
seminarUpdateValidator = validator(seminarUpdateValidator);

module.exports = {
  seminarCreateValidator,
  seminarUpdateValidator,
};
