var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var threadSchema = new Schema({
    id                   : Number,
    user_id              : Number,
    provider_name        : String,
    provider_uid         : String
});

module.exports = mongoose.model('Identity', threadSchema);