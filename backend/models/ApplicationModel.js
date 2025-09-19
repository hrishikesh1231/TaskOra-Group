const mongoose = require('mongoose');

const { ApplicationSchema } = require('../schemas/ApplicationSchema');

const Application = mongoose.model('application', ApplicationSchema);

module.exports={Application};