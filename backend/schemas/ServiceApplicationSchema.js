// // const mongoose = require("mongoose");
// // const { Schema } = mongoose;

// // const ServiceApplicationSchema = new Schema({
// //   service: { type: mongoose.Schema.Types.ObjectId, ref: "service", required: true },
// //   applicant: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
// //   name: { type: String, required: true },
// //   message: { type: String, required: true },
// //   contact: { type: String, required: true },
// //   charges: { type: String, required: true },
// //   pictures: [String],
// //   createdAt: { type: Date, default: Date.now },
// // });

// // module.exports = { ServiceApplicationSchema };


// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// const ServiceApplicationSchema = new Schema(
//   {
//     service: {
//       type: Schema.Types.ObjectId,
//       ref: "Service", // ✅ FIXED (case-sensitive)
//       required: true,
//     },
//     applicant: {
//       type: Schema.Types.ObjectId,
//       ref: "User", // ✅ FIXED
//       required: true,
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     message: {
//       type: String,
//       required: true,
//     },
//     contact: {
//       type: String,
//       required: true,
//     },
//     charges: {
//       type: String,
//       required: true,
//     },
//     pictures: [String],
//   },
//   { timestamps: true }
// );

// // ✅ EXPORT MODEL (NOT SCHEMA)
// module.exports = mongoose.model(
//   "ServiceApplication",
//   ServiceApplicationSchema
// );


const mongoose = require("mongoose");
const { Schema } = mongoose;

const ServiceApplicationSchema = new Schema(
  {
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    applicant: {
      type: Schema.Types.ObjectId,
      ref: "user", // ✅ FIXED
      required: true,
    },
    name: String,
    message: String,
    contact: String,
    charges: String,
    pictures: [String],
  },
  { timestamps: true }
);

module.exports = ServiceApplicationSchema;
