const Joi = require('joi');

const passwordRegExPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const phoneNoRegExPattern = /^\+94\d{9}$/;

const tutorStaffFormSchema = Joi.object({
  user: Joi.string().min(4).required().messages({
    "string.base": "Username should be a string",
    "string.empty": "Username is required",
    "string.min": "Username must be at least 4 characters long",
    "any.required": "Username is required",
  }),
  pwd: Joi.string().regex(passwordRegExPattern).min(8).required().messages({
    "string.base": "Password should be a string",
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters long",
    "string.pattern.base":
      "Password should contain at least one lowercase letter, one uppercase letter, and one digit",
    "any.required": "Password is required",
  }),
  repeatPwd: Joi.string().required().valid(Joi.ref("pwd")).messages({
    "string.base": "Password must be a string",
    "any.required": "Repeat password is required",
    "any.only": "Passwords do not match",
  }),
  fName: Joi.string().min(3).max(50).required().messages({
    "string.base": "First name should be String",
    "string.empty": "First name is required",
    "string.min": "First name must be at least 3 characters long",
    "string.max": "First name must be at most 50 characters long",
    "any.required": "First name is required",
  }),
  lName: Joi.string().min(3).max(50).required().messages({
    "string.base": "First name should be String",
    "string.empty": "First name is required",
    "string.min": "First name must be at least 3 characters long",
    "string.max": "First name must be at most 50 characters long",
    "any.required": "First name is required",
  }),
  phoneNo: Joi.string().regex(phoneNoRegExPattern).required().messages({
    "strint.empty": "Phone number is required",
    "string.pattern.base": "Enter valid phone number in Sri Lanka",
    "any.required": "Phone number is required",
  }),
});

module.exports = tutorStaffFormSchema;

