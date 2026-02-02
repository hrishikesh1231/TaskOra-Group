const {Schema} = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose'); 

const UserSchema =new Schema({
    email:String,
    tokens: {
    type: Number,
    default: 100
    }

});


UserSchema.plugin(passportLocalMongoose);
module.exports = {UserSchema};

