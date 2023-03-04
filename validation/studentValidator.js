const Joi = require("joi");
//school,faculty,isActive,firstName,middleName,lastName,email,age,gender

let studentCreateValidator = Joi.object({
  school: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages(),
  faculty: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages(),
  isActive: Joi.boolean().default(true).messages(),
  firstName: Joi.string().trim().max(255).required().messages(),
  middleName: Joi.string().trim().max(255).required().messages(),
  lastName: Joi.string().trim().max(255).required().messages(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages(),
  age: Joi.string().trim().max(255).required().messages(),
  gender: Joi.string().trim().max(255).required().messages(),
});

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });
studentCreateValidator = validator(studentCreateValidator);

let studentUpdateValidator = Joi.object({
  school: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages(),
  faculty: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages(),
  isActive: Joi.boolean().default(true).messages(),
  firstName: Joi.string().trim().max(255).messages(),
  middleName: Joi.string().trim().max(255).messages(),
  lastName: Joi.string().trim().max(255).messages(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .messages(),
  age: Joi.string().trim().max(255).messages(),
  gender: Joi.string().trim().max(255).messages(),
});

studentUpdateValidator = validator(studentUpdateValidator);

module.exports = {
  studentCreateValidator,
  studentUpdateValidator,
};
