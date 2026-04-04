const Joi = require("joi");

// ================= GIG APPLICATION =================
const applyGigSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
    }),

  message: Joi.string()
    .min(3) // ✅ fixed
    .required()
    .messages({
      "string.min": "Message must be at least 10 characters",
    }),

  contact: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Contact must be 10-digit number",
    }),

  charges: Joi.string()
    .required()
    .messages({
      "string.empty": "Charges is required",
    }),
});


// ================= SERVICE APPLICATION =================
const applyServiceSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
    }),

  message: Joi.string()
    .min(3) // ✅ fixed
    .required()
    .messages({
      "string.min": "Message must be at least 10 characters",
    }),

  contact: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Contact must be 10-digit number",
    }),

  charges: Joi.string()
    .required()
    .messages({
      "string.empty": "Charges is required",
    }),
});

module.exports = {
  applyGigSchema,
  applyServiceSchema,
};