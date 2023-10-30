const Joi = require('joi');

const addPollSchema = Joi.object({

  question: Joi.string().max(1000).required().messages({
    'string.base': 'Question should be a string',
    'string.empty': 'Question is required',
    'any.required': 'Question is required',
    'string.max': 'Question must be at most 1000 characters long',
  }),
  options: Joi.string().max(1000).required().messages({
    'string.base': 'options should be a string',
    'string.empty': 'options is required',
    'string.max': 'options must be at most 1000 characters long',
    'any.required': 'options is required',
  }),
  course_id: Joi.string().min(3).max(50).required().messages({
    'string.base': 'Course ID should be String',
    'string.empty': 'Course ID is required',
    'any.required': 'Course ID is required',
  }),

  


});

module.exports = addPollSchema;

