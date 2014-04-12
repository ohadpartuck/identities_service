var Identity =  require(GLOBAL.ROOT + '/app/models/identity.js');

exports.create_a_new_identity = function(req, callback) {
    //post to facebook to get the user data

    var new_identity = new Identity(req.body).save();
    return {done: true};
};