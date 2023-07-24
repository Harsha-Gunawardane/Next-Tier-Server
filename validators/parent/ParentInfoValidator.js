const Joi = require('joi');

const phoneNoRegExPattern = /^\+94\d{9}$/;

const parentInfoSchema = Joi.object({
  fName: Joi.string().min(3).max(50).required().messages({
    'string.base': 'First name should be a string',
    'string.empty': 'First name is required',
    'string.min': 'First name must be at least 3 characters long',
    'string.max': 'First name must be at most 50 characters long',
    'any.required': 'First name is required',
  }),
  phoneNo: Joi.string().regex(phoneNoRegExPattern).required().messages({
    'string.empty': 'Phone number is required',
    'string.pattern.base': 'Enter a valid phone number in Sri Lanka',
    'any.required': 'Phone number is required',
  }),
});

module.exports = parentInfoSchema;
