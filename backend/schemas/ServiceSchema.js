


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
    required: true,
  },

  state: {
    type: String,
    required: true,
  },

  district: {
    type: String,
    required: true,
    index: true,
  },

  taluka: {
    type: String,
    required: true,
    index: true, // 🔥 helps faster search
  },

  location: {
    type: String, // area/locality
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

ServiceSchema.index({ geoLocation: "2dsphere" });

module.exports = { ServiceSchema };
