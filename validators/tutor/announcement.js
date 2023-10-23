const Joi = require('joi');

const addAnnouncementSchema = Joi.object({

  header: Joi.string().max(300).required().messages({
    'string.base': 'Question should be a string',
    'string.empty': 'Question is required',
    'any.required': 'Question is required',
    'string.max': 'Question must be at most 1000 characters long',
  }),
  message: Joi.string().max(1000).required().messages({
    'string.base': 'options should be a string',
    'string.empty': 'options is required',
    'string.max': 'options must be at most 1000 characters long',
    'any.required': 'options is required',
  }),


  


});

module.exports = addAnnouncementSchema;

