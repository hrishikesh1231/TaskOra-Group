

// const { Schema } = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");

// const UserSchema = new Schema(
//   {
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     state: {
//       type: String,
//       required: true,
//     },
//     district: {
//       type: String,
//       required: true,
//     },
//     tokens: {
//     type: Number,
//     default: 100
//     },
//      resetPasswordToken: String,
//     resetPasswordExpire: Date,
//   },
//   { timestamps: true }
// );

// UserSchema.plugin(passportLocalMongoose); // adds username + password hash

// module.exports = { UserSchema };


// const { Schema } = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");

// const UserSchema = new Schema(
//   {
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     state: {
//       type: String,
//       required: true,
//     },
//     district: {
//       type: String,
//       required: true,
//     },

//     tokens: {
//       type: Number,
//       default: 100,
//     },

//     // ✅ ADD THIS (Admin Role)
//     role: {
//       type: String,
//       enum: ["user", "admin"],
//       default: "user",
//     },

//     // ✅ ADD THIS (Ban System)
//     isBanned: {
//       type: Boolean,
//       default: false,
//     },

//     resetPasswordToken: String,
//     resetPasswordExpire: Date,
//   },
//   { timestamps: true }
// );

// UserSchema.plugin(passportLocalMongoose);

// module.exports = { UserSchema };





const { Schema } = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema(
  {
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
    tokens: {
    type: Number,
    default: 100
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
     resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

UserSchema.plugin(passportLocalMongoose); // adds username + password hash

module.exports = { UserSchema };

