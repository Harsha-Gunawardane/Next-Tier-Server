const Joi = require("joi");

const phoneNoRegExPattern = /^\+94\d{9}$/;
const emailErgExPattern = /^\S+@\S+$/;

const roles = ["System", "Network", "Database", "Cloud", "Security"];

const registerFormSchema = Joi.object({
  fName: Joi.string().min(3).max(50).required().messages({
    "string.base": "First name should be String",
    "string.empty": "First name is required",
    "string.min": "First name must be at least 3 characters long",
    "string.max": "First name must be at most 50 characters long",
    "any.required": "First name is required",
  }),
  lName: Joi.string().min(3).max(50).required().messages({
    "string.base": "First name should be String",
    "string.empty": "First name is required",
    "string.min": "First name must be at least 3 characters long",
    "string.max": "First name must be at most 50 characters long",
    "any.required": "First name is required",
  }),
  mobileNo: Joi.string().regex(phoneNoRegExPattern).required().messages({
    "strint.empty": "Phone number is required",
    "string.pattern.base": "Enter valid phone number in Sri Lanka",
    "any.required": "Phone number is required",
  }),
  emergencyContact: Joi.string()
    .regex(phoneNoRegExPattern)
    .required()
    .messages({
      "strint.empty": "Phone number is required",
      "string.pattern.base": "Enter valid phone number in Sri Lanka",
      "any.required": "Phone number is required",
    }),
    email: Joi.string()
    .regex(emailErgExPattern)
    .required()
    .messages({
      "strint.empty": "Email is required",
      "string.pattern.base": "Enter valid email",
      "any.required": "Email is required",
    }),
  address: Joi.string().min(10).max(100).required().messages({
    "string.base": "Address should be String",
    "string.empty": "Address is required",
    "string.min": "Address must be at least 10 characters long",
    "string.max": "Address must be at most 100 characters long",
    "any.required": "Address is required",
  }),
  role: Joi.string().valid(...roles).required().messages({
    'any.only': 'Role should be one of the following: System, Network, Database, Cloud, Security]',
    'any.required': 'Role is required',
  }),
  qualifications: Joi.array().min(1).required().messages({
    'array.base': 'Qualification should be an array',
    'array.min': 'At least one qualification is required',
    'any.required': 'Qualifications are required',
  })
});

module.exports = registerFormSchema;
