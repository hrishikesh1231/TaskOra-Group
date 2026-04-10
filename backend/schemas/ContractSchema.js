

const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const contractSchema = new Schema(
  {
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      default: null,
    },

    // 🔹 Service support
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null,
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    applicantContact: {
      type: String,
      required: true,
    },

    recruiterConfirmed: {
      type: Boolean,
      default: false,
    },

    applicantConfirmed: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: [
        "recruiter_confirmed",
        "applicant_confirmed",
        "both_confirmed",
        "rejected",
        "expired",
        "cancelled",
      ],
      default: "recruiter_confirmed",
    },

    tokensDeducted: {
      type: Boolean,
      default: false,
    },

    // 🔥 ================= NEW FEATURE =================
    // Unique verification code (your idea)
    verificationCode: {
      type: String,
      unique: true,
      default: null,
    },
    // ================================================
    // 🔥 Physical verification system
    arrivalCode: {
      type: String,
      default: null,
    },

    arrivalCodeExpires: {
      type: Date,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Contract", contractSchema);
