const Joi = require('joi');


const gradeRegExPattern = /^\+94\d{9}$/;

const courseeditFormSchema = Joi.object({

  subject: Joi.string().required().messages({
    'string.base': 'Subject should be a string',
    'string.empty': 'Subject is required',
    'any.required': 'Subject is required',
  }),
  description: Joi.string().min(40).max(800).required().messages({
    'string.base': 'Description should be a string',
    'string.empty': 'Description is required',
    'string.max': 'Description must be at most 1000 characters long',
    'any.required': 'Description is required',
  }),
  medium: Joi.string().required().messages({
    'string.base': 'Medium must be a string',
    'any.required': 'Medium is required',

  }),
  grade: Joi.string().min(3).regex(gradeRegExPattern).max(50).required().messages({
    'string.base': 'Grade should be String',
    'string.empty': 'Grade name is required',
    'any.required': 'Grade is required',
  }),
//   title: Joi.string().min(3).max(50).required().messages({
//     'string.base': 'Title should be String',
//     'string.empty': 'Title is required',
//     'string.max': 'Title must be at most 50 characters long',
//     'any.required': 'Title is required',
//   }),
  // hall_id: Joi.string().required().messages({
  //   'string.base': 'Hall ID should be String',
  //   'string.empty': 'Hall ID is required',
  //   'any.required': 'Hall ID is required',
  // }),
  thumbnail: Joi.string().required().messages({
    'string.empty': 'Thumbnail is required',
    'any.required': 'Thumbnail is required',
  }),
//   tutor_id: Joi.string().required().messages({
//     'string.empty': 'Tutor ID is required',
//     'any.required': 'Tutor ID is required',
//   }),
  monthly_fee: Joi.number().required().min(0).messages({
    'number.base': 'Monthly fee must be a number',
    'number.empty': 'Monthly fee is required',
    'number.min': 'Monthly fee cannot be negative',
    'any.required': 'Monthly fee is required',
  })
});

module.exports = courseeditSchema;

