const Joi = require("joi");

const tutorMcqFormSchema = Joi.object({
  question: Joi.string().min(3).required().messages({
    "string.base": "Question should be a string",
    "string.empty": "Question is required",
    "string.min": "Question must be at least 3 characters long",
    "any.required": "Question is required",
  }),
  points: Joi.number().integer().min(0).required().messages({
    "number.base": "Points should be a number",
    "number.integer": "Points should be an integer",
    "any.required": "Points is required",
  }),
  difficulty_level: Joi.string().valid("Medium", "Hard").required().messages({
    "string.base": "Difficulty level should be a string",
    "string.empty": "Difficulty level is required",
    "any.only": "Invalid difficulty level",
    "any.required": "Difficulty level is required",
  }),
  subject: Joi.string().min(3).max(30).required().messages({
    "string.base": "Subject should be a string",
    "string.empty": "Subject is required",
    "string.min": "Subject must be at least 3 characters long",
    "string.max": "Subject must be at most 30 characters long",
    "any.required": "Subject is required",
  }),
  subject_areas: Joi.array()
    .items(Joi.string().min(3).max(30))
    .required()
    .messages({
      "array.base": "Subject areas should be an array",
      "any.required": "Subject areas are required",
    }),
  options: Joi.array()
    .min(4)
    .max(5)
    .items(Joi.string().min(1).max(50))
    .required()
    .messages({
      "array.base": "Options should be an array",
      "array.min": "Options should have at least 4 elements",
      "array.max": "Options should have at most 5 elements",
      "any.required": "Options are required",
    }),
  correct_answer: Joi.number().integer().min(0).required().messages({
    "number.base": "Correct answer should be a number",
    "number.integer": "Correct answer should be an integer",
    "any.required": "Correct answer is required",
  }),
  explanation: Joi.string().min(3).max(800).required().messages({
    "string.base": "Explanation should be a string",
    "string.empty": "Explanation is required",
    "string.min": "Explanation must be at least 3 characters long",
    "string.max": "Explanation must be at most 800 characters long",
    "any.required": "Explanation is required",
  }),
});

module.exports = tutorMcqFormSchema;
