const mongoose = require("mongoose");
const { ServiceApplicationSchema } = require("../schemas/ServiceApplicationSchema");

const ServiceApplication = mongoose.model("ServiceApplication", ServiceApplicationSchema);
module.exports = { ServiceApplication };


// models/Servicemodel.js
// const mongoose = require("mongoose");
// // const { ServiceSchema } = require("../schemas/ServiceSchema");

// const Service = mongoose.model("Service", Ser); Servicepll// ✅ Capital S

// module.exports = { Service };
