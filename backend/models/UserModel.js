// const {model} = require('mongoose');
// const { UserSchema } = require('../schemas/UserSchema');

// const UserModel = new model("user",UserSchema);
// module.exports = {UserModel};

const mongoose = require("mongoose");
const { UserSchema } = require("../schemas/UserSchema");

// ✅ Model name MUST match ref: "User"
const UserModel = mongoose.model("User", UserSchema);

module.exports = { UserModel };
