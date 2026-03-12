// const { Schema } = require('mongoose');
// const mongoose = require("mongoose");

// const ServiceSchema = new Schema({
//   title: { type: String, required: true },         // Job title
//   description: { type: String, required: true },   // Brief role description
//   salary: { type: String, required: true },        // e.g., ₹9,500/month
//   location: { type: String, required: true },      // City

//   postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },      // Company or Person

//   contact: { type: String, required: true },       // Phone number
//   date: { type: Date, required: true },            // dd-mm-yyyy
//   createdAt: { type: Date, default: Date.now }     // Auto timestamp
// });

// module.exports = { ServiceSchema };


const mongoose = require("mongoose");
const { Schema } = mongoose;

const ServiceSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  salary: {
    type: String,
    required: true, // e.g. ₹9,500/month
  },

  state: {
    type: String,
    required: true, // e.g. Maharashtra
  },

  district: {
    type: String,
    required: true, // 🔥 MAIN FILTER FIELD
    index: true,
  },

  location: {
    type: String, // area / locality
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
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = { ServiceSchema };

