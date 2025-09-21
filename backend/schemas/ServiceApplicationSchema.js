const mongoose = require("mongoose");
const { Schema } = mongoose;

const ServiceApplicationSchema = new Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: "service", required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  name: { type: String, required: true },
  message: { type: String, required: true },
  contact: { type: String, required: true },
  charges: { type: String, required: true },
  pictures: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = { ServiceApplicationSchema };
