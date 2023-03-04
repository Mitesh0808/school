const Joi = require("joi");

//school,//firstName,lastName,email,subject,message
let inquiryCreateValidator = Joi.object({
  school: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  firstName: Joi.string().max(255).trim().required().messages(),
  lastName: Joi.string().max(255).trim().required().messages(),
  email: Joi.string().email().required().messages(),
  subject: Joi.string().max(255).trim().required().messages(),
  message: Joi.string().max(255).trim().required().messages(),
});

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });
inquiryCreateValidator = validator(inquiryCreateValidator);

let inquiryUpdateValidator = Joi.object({
  school: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages(),
  firstName: Joi.string().max(255).trim().messages(),
  lastName: Joi.string().max(255).trim().messages(),
  email: Joi.string().email().messages(),
  subject: Joi.string().max(255).trim().messages(),
  message: Joi.string().max(255).trim().messages(),
});
inquiryUpdateValidator = validator(inquiryUpdateValidator);
module.exports = {
  inquiryCreateValidator,
  inquiryUpdateValidator,
};
