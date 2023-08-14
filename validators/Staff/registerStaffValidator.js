const Joi = require('joi');

const phoneNoRegExPattern = /^\+94\d{9}$/;

const registerStaffSchema = Joi.object({
    username: Joi.string().min(4).required().messages({
    'string.base': 'Username should be a string',
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 4 characters long',
    'any.required': 'Username is required',
  }),

  firstName: Joi.string().min(3).max(50).required().messages({
    'string.base': 'First name should be String',
    'string.empty': 'First name is required',
    'string.min': 'First name must be at least 3 characters long',
    'string.max': 'First name must be at most 50 characters long',
    'any.required': 'First name is required',
  }),
  lastName: Joi.string().min(3).max(50).required().messages({
    'string.base': 'First name should be String',
    'string.empty': 'First name is required',
    'string.min': 'First name must be at least 3 characters long',
    'string.max': 'First name must be at most 50 characters long',
    'any.required': 'First name is required',
  }),
  phoneNumber: Joi.string().regex(phoneNoRegExPattern).required().messages({
    'strint.empty': 'Phone number is required',
    'string.pattern.base': 'Enter valid phone number in Sri Lanka',
    'any.required': 'Phone number is required',
  }),
  DOB: Joi.date()
  .iso()
  .max(new Date().toISOString().split('T')[0]) // Maximum date is today
  .min(new Date(new Date().getFullYear() - 60, 0, 1).toISOString().split('T')[0]) // Minimum date is 60 years ago
  .required()
  .messages({
    'date.base': 'Date of Birth should be a valid date',
    'date.empty': 'Date of Birth is required',
    'date.max': 'Staff must be above 18 years old',
    'date.min': 'Staff must be below 60 years old',
    'any.required': 'Date of Birth is required',
  }),
});

module.exports = registerStaffSchema;

