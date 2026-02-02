// <<<<<<< HEAD
// const {model} = require('mongoose');

const mongoose = require("mongoose");
const { UserSchema } = require('../schemas/UserSchema');
// =======
// // const {model} = require('mongoose');
// // const { UserSchema } = require('../schemas/UserSchema');
// >>>>>>>

// const UserModel = new model("user",UserSchema);
// module.exports = {UserModel};

// const { UserSchema } = require("../schemas/UserSchema");

// ✅ Model name MUST match ref: "User"
const UserModel = mongoose.model("user", UserSchema);

module.exports = { UserModel };
