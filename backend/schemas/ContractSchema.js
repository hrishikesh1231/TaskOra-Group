
const mongoose = require("mongoose");
const { Schema } = require('mongoose');

const contractSchema = new Schema(
  {
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    recruiterConfirmed: {
      type: Boolean,
      default: false
    },

    applicantConfirmed: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: [
        "pending",
        "recruiter_confirmed",
        "applicant_confirmed",
        "both_confirmed"
      ],
      default: "pending"
    },

    tokensDeducted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = { contractSchema };