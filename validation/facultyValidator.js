const Joi = require("joi");
//school,isActive,fullName,email,phoneNo

let facultyCreateValidator = Joi.object({
  school: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages(),
  isActive: Joi.boolean().default(true).messages(),
  fullName: Joi.string().max(100).required().messages(),
  email: Joi.string().email().required().messages(),
  phoneNo: Joi.string()
    .pattern(
      new RegExp(
        /^(\d{3}[-\s]?\d{3}[-\s]?\d{4}|\(\d{3}\)\s*\d{3}[-\s]?\d{4}|\d{10})$/
      )
    )
    .required()
    .messages(),
});
const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

facultyCreateValidator = validator(facultyCreateValidator);

let facultyUpdateValidator = Joi.object({
  school: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages(),
  isActive: Joi.boolean().default(true).messages(),
  fullName: Joi.string().max(100).messages(),
  email: Joi.string().email().messages(),
  phoneNo: Joi.string()
    .pattern(
      new RegExp(
        /^(\d{3}[-\s]?\d{3}[-\s]?\d{4}|\(\d{3}\)\s*\d{3}[-\s]?\d{4}|\d{10})$/
      )
    )
    .messages(),
});
facultyUpdateValidator = validator(facultyUpdateValidator);

module.exports = {
  facultyCreateValidator,
  facultyUpdateValidator,
};
