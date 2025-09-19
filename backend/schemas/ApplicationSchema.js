const { Schema } = require('mongoose');
const mongoose = require("mongoose");

const ApplicationSchema = Schema({
    gig: { type: mongoose.Schema.Types.ObjectId, ref: "gig", required: true }, // the gig applied to
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // the logged-in user
    name: { type: String, required: true }, // applicant name
    message: { type: String, required: true }, // why they want the gig
    contact: { type: String, required: true }, // phone/email
    charges: { type: String, required: true }, // expected pay (string so you can store ₹500/day etc.)
    pictures: [String], // filenames of uploaded pictures (multer saves these)
    createdAt: { type: Date, default: Date.now },
})

module.exports = {ApplicationSchema};