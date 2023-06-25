const Joi = require('joi');

const passwordRegExPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const loginFormSchema = Joi.object({
  user: Joi.string().min(4).required(),
  pwd: Joi.string().regex(passwordRegExPattern).min(8).required(),
});

module.exports = loginFormSchema;
