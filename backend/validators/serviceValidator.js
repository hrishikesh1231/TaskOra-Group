const Joi = require("joi");

// ✅ normalize today's date
const today = new Date();
today.setHours(0, 0, 0, 0);

const serviceSchema = Joi.object({
  title: Joi.string()
    .min(5) // ✅ fixed
    .max(100)
    .required()
    .messages({
      "string.empty": "Title is required",
      "string.min": "Title must be at least 5 characters",
      "string.max": "Title should not exceed 100 characters",
    }),

  description: Joi.string()
    .min(20) // ✅ fixed (not 200)
    .required()
    .messages({
      "string.min": "Description must be at least 20 characters",
    }),

  salary: Joi.string()
    .required()
    .messages({
      "string.empty": "Salary is required",
    }),

  state: Joi.string().required(),

  district: Joi.string().required(),

  taluka: Joi.string().required(),

  location: Joi.string().optional().allow(""),

  date: Joi.date()
    .min(today) // ✅ allows today
    .required()
    .messages({
      "date.min": "Date cannot be in the past",
    }),

  contact: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Contact must be a valid 10-digit number",
    }),
});

module.exports = serviceSchema;