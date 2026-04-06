

const { Schema } = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema(
  {
    // ✅ ADD THIS
    name: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    state: {
      type: String,
      required: true,
    },

    district: {
      type: String,
      required: true,
    },

    // ✅ ADD THIS
    avatar: {
      type: String,
      default: "",
    },

    tokens: {
      type: Number,
      default: 100,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },
    mobile: {
      type: String,
      unique: true,
    },
    isMobileVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    isVerified: {
      type: Boolean,
      default: false
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

UserSchema.plugin(passportLocalMongoose);

module.exports = { UserSchema }; 