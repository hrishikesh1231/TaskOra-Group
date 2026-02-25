
const mongoose = require("mongoose");
const { Schema } = mongoose;

const GigSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    required: true,   // e.g. Maharashtra
  },

  district: {
    type: String,
    required: true,   // 🔥 MAIN FILTER FIELD
    index: true,
  },

  location: {
    type: String,     // area / locality (Panaji, Andheri, etc.)
  },

  category: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  contact: {
    type: String,
    required: true,
  },

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = { GigSchema };