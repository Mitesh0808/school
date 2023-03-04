const Joi = require("joi");
//isActive,school,courseName,description,fees,duration

let courseCreateValidator = Joi.object({
  isActive: Joi.boolean().default(true),
  courseName: Joi.string().trim().max(255).required().messages(),
  description: Joi.string().trim().max(255).required().messages(),
  fees: Joi.string().trim().max(100).required().messages(),
  duration: Joi.string().trim().max(50).required().messages(),
  school: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
}).messages();
const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

courseCreateValidator = validator(courseCreateValidator);

let courseUpdateValidator = Joi.object({
  isActive: Joi.boolean().default(true).messages(),
  courseName: Joi.string().trim().max(255).messages(),
  description: Joi.string().trim().max(255).messages(),
  fees: Joi.string().trim().max(100).messages(),
  duration: Joi.string().trim().max(50).messages(),
  school: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages(),
});

courseUpdateValidator = validator(courseUpdateValidator);

//regex(/^[0-9a-fA-F]{24}$/) for mongo _id validation 24 length hex
module.exports = {
  courseCreateValidator,
  courseUpdateValidator,
};
//Insert your joi schema here
// Joi.object({
//   age: Joi.number().required().messages({'age': test age required'}),
// })

// const schema = Joi.object().keys({
//   title: Joi.string()
//     .min(minLength)
//     .max(maxLength)
//     .required()
//     .error((errors) => {
//       return errors.map(error => {
//         switch (error.type) {
//           case "string.min":
//             return { message: "first msg" };
//           case "string.max":
//             return { message: "second msg" };
//           case "any.empty":
//             return { message: "third msg" };
//         }
//       }
//       )
//     })
