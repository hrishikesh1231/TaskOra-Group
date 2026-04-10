

const mongoose = require("mongoose");
const schema = require("../schemas/ServiceApplicationSchema");

module.exports = mongoose.model("ServiceApplication", schema);
