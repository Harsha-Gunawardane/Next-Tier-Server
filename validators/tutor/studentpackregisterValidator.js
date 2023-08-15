const Joi = require('joi');


const gradeRegExPattern = /^\+94\d{9}$/;

const courseregisterFormSchema = Joi.object({

  subject: Joi.string().required().messages({
    'string.base': 'Subject should be a string',
    'string.empty': 'Subject is required',
    'any.required': 'Subject is required',
  }),
  description: Joi.string().min(40).max(200).required().messages({
    'string.base': 'Description should be a string',
    'string.empty': 'Description is required',
    'string.min': 'Description must be at least 40 characters long',
    'string.max': 'Description must be at most 200 characters long',
    'any.required': 'Description is required',
  }),
  title: Joi.string().min(3).max(50).required().messages({
    'string.base': 'Title should be String',
    'string.empty': 'Title is required',
    'string.max': 'Title must be at most 50 characters long',
    'any.required': 'Title is required',
  }),

  thumbnail: Joi.string().required().messages({
    'string.empty': 'Thumbnail is required',
    'any.required': 'Thumbnail is required',
  }),
  course_id: Joi.string().required().messages({
    'string.empty': 'Course ID is required',
    'any.required': 'Course ID is required',
  }),
  price: Joi.number().required().min(0).messages({
    'number.base': 'Price must be a number',
    'number.empty': 'Price is required',
    'number.min': 'Price cannot be negative',
    'any.required': 'Price is required',
  })
});

module.exports = courseregisterFormSchema;

