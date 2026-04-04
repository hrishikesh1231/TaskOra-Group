const Joi = require("joi");

// ✅ Normalize today's date (ignore time)
const today = new Date();
today.setHours(0, 0, 0, 0);

const gigSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(100)
    .required()
    .messages({
      "string.empty": "Title is required",
      "string.min": "Title must be at least 5 characters",
      "string.max": "Title should not exceed 100 characters",
    }),

  description: Joi.string()
    .min(3)
    .required()
    .messages({
      "string.min": "Description must be at least 20 characters",
    }),

  state: Joi.string().required(),

  district: Joi.string().required(),

  taluka: Joi.string().optional().allow(""),

  location: Joi.string().optional().allow(""),

  category: Joi.string().required(),

  date: Joi.date()
    .min(today) // ✅ allows today + future
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

  // ✅ optional (if you use map)
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
});

module.exports = gigSchema;