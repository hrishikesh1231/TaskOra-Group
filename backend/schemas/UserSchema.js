// const {Schema} = require('mongoose');
// const passportLocalMongoose = require('passport-local-mongoose'); 

// const UserSchema =new Schema({
//     email:String,
// });


// UserSchema.plugin(passportLocalMongoose);
// module.exports = {UserSchema};




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
  },
  { timestamps: true }
);

UserSchema.plugin(passportLocalMongoose); // adds username + password hash

module.exports = { UserSchema };



