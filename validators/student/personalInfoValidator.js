const Joi = require('joi');

const phoneNoRegExPattern = /^\+94\d{9}$/;

const streamOptions = ['Mathematics', 'Bio', 'Commerce', 'Art'];
const mediumOptions = ['English', 'Sinhala'];

const personalInfoSchema = Joi.object({
  fName: Joi.string().min(3).max(50).required().messages({
    'string.base': 'First name should be a string',
    'string.empty': 'First name is required',
    'string.min': 'First name must be at least 3 characters long',
    'string.max': 'First name must be at most 50 characters long',
    'any.required': 'First name is required',
  }),
  lName: Joi.string().min(3).max(50).required().messages({
    'string.base': 'Last name should be a string',
    'string.empty': 'Last name is required',
    'string.min': 'Last name must be at least 3 characters long',
    'string.max': 'Last name must be at most 50 characters long',
    'any.required': 'Last name is required',
  }),
  phoneNo: Joi.string().regex(phoneNoRegExPattern).required().messages({
    'string.empty': 'Phone number is required',
    'string.pattern.base': 'Enter a valid phone number in Sri Lanka',
    'any.required': 'Phone number is required',
  }),
  stream: Joi.string().valid(...streamOptions).required().messages({
    'any.only': 'Stream should be one of the following: Mathematics, Bio, Commerce, Art',
    'any.required': 'Stream is required',
  }),
  medium: Joi.string().valid(...mediumOptions).required().messages({
    'any.only': 'Stream should be one of the following: English, Sinhala',
    'any.required': 'Medium is required',
  }),
  college: Joi.string().min(8).max(50).required().messages({
    'string.base': 'college should be a string',
    'string.empty': 'college is required',
    'string.min': 'college must be at least 8 characters long',
    'string.max': 'college must be at most 50 characters long',
    'any.required': 'college is required',
  }),
  address: Joi.string().min(5).max(50).required().messages({
    'string.base': 'address should be a string',
    'string.empty': 'address is required',
    'string.min': 'address must be at least 5 characters long',
    'string.max': 'address must be at most 50 characters long',
    'any.required': 'address is required',
  })
});

module.exports = personalInfoSchema;
