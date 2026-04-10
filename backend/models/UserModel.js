

const mongoose = require("mongoose");
const { UserSchema } = require("../schemas/UserSchema");

//  SAFE VERSION (NO DUPLICATE MODEL)
const UserModel =
  mongoose.models.user || mongoose.model("user", UserSchema);

module.exports = { UserModel };
