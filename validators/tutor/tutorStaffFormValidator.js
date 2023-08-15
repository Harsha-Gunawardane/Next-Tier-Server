const Joi = require("joi");

const phoneNoRegExPattern = /^\+94\d{9}$/;
const staffTitleValues = ["Cls Supporting Staff", "Paper Marking Staff"];

const tutorStaffFormSchema = Joi.object({
  first_name: Joi.string().min(3).max(50).required().messages({
    "string.base": "First name should be String",
    "string.empty": "First name is required",
    "string.min": "First name must be at least 3 characters long",
    "string.max": "First name must be at most 50 characters long",
    "any.required": "First name is required",
  }),
  last_name: Joi.string().min(3).max(50).required().messages({
    "string.base": "First name should be String",
    "string.empty": "First name is required",
    "string.min": "First name must be at least 3 characters long",
    "string.max": "First name must be at most 50 characters long",
    "any.required": "First name is required",
  }),
  NIC: Joi.string().min(10).max(12).required().messages({
    "string.base": "NIC should be String",
    "string.empty": "NIC is required",
    "string.min": "NIC must be at least 10 characters long",
    "string.max": "NIC must be at most 12 characters long",
    "any.required": "NIC is required",
  }),
  DOB: Joi.date().required().messages({
    "date.base": "Invalid date format",
    "any.required": "Date of birth is required",
  }),
  address: Joi.string().min(5).max(50).required().messages({
    "string.base": "address should be a string",
    "string.empty": "address is required",
    "string.min": "address must be at least 5 characters long",
    "string.max": "address must be at most 50 characters long",
    "any.required": "address is required",
  }),
  phone_number: Joi.string().regex(phoneNoRegExPattern).required().messages({
    "strint.empty": "Phone number is required",
    "string.pattern.base": "Enter valid phone number in Sri Lanka",
    "any.required": "Phone number is required",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email should be a string",
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  staff_title: Joi.string().valid(...staffTitleValues).required().messages({
    'string.base': 'Staff title should be a string',
    'string.empty': 'Staff title is required',
    'any.only': `Staff title must be one of: ${staffTitleValues.join(', ')}`,
    'any.required': 'Staff title is required',
  }),
});

module.exports = tutorStaffFormSchema;
