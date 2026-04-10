const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  tokens: Number,
  amount: Number,
  status: {
    type: String,
    enum: ["processing", "paid", "failed"],
    default: "processing",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Withdraw", withdrawSchema);