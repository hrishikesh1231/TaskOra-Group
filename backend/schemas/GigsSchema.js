

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
    required: true,
  },

  district: {
    type: String,
    required: true,
    index: true,
  },

    taluka: {
    type: String,
    
  },


  location: {
    type: String, // Area or locality
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

  isActive: {
    type: Boolean,
    default: true,
  }

});

// 🔥 enable geo search
GigSchema.index({ coordinates: "2dsphere" });

module.exports = { GigSchema };
