const Joi = require('joi');

const passwordRegExPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const resetPasswordSchema = Joi.object({
    user: Joi.string().min(4).required().messages({
        'string.base': 'Username should be a string',
        'string.empty': 'Username is required',
        'string.min': 'Username must be at least 4 characters long',
        'any.required': 'Username is required',
      }),
      pwd: Joi.string().regex(passwordRegExPattern).min(8).required().messages({
        'string.base': 'Password should be a string',
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password should contain at least one lowercase letter, one uppercase letter, and one digit',
        'any.required': 'Password is required',
      }),
      confirmPwd: Joi.string().required().valid(Joi.ref('pwd')).messages({
        'string.base': 'Password must be a string',
        'any.required': 'Repeat password is required',
        'any.only': 'Passwords do not match'
      }),
});

module.exports = resetPasswordSchema;