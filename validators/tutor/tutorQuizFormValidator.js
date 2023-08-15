const Joi = require("joi");

const tutorQuizFormSchema = Joi.object({
  title: Joi.string().min(3).max(80).required().messages({
    "string.base": "Title should be a string",
    "string.empty": "Title is required",
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title must be at most 80 characters long",
    "any.required": "Title is required",
  }),
  subject: Joi.string().min(3).max(20).required().messages({
    "string.base": "Subject should be a string",
    "string.empty": "Subject is required",
    "string.min": "Subject must be at least 3 characters long",
    "string.max": "Subject must be at most 20 characters long",
    "any.required": "Subject is required",
  }),
  subject_areas: Joi.array().items(Joi.string().min(3).max(20)).messages({
    "array.base": "Subject areas should be an array",
    "any.required": "Subject areas are required",
  }),
  number_of_questions: Joi.number().integer().min(0).required().messages({
    "number.base": "Number of questions should be a number",
    "number.integer": "Number of questions should be an integer",
    "any.required": "Number of questions is required",
  }),
  question_ids: Joi.array().items(Joi.string().min(1).max(50)).messages({
    "array.base": "Question IDs should be an array",
    "any.required": "Question IDs are required",
  }),
});

module.exports = tutorQuizFormSchema;
