var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var threadSchema = new Schema({
    id                   : Number,
    username             : String,
    email                : String,
    crypted_password     : String,
    password_salt        : String
});

module.exports = mongoose.model('User', threadSchema);