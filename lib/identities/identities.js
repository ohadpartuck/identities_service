//comm
var Identity =  require(GLOBAL.ROOT + '/app/models/identity.js');
var passport = require('passport');
var FacebookTokenStrategy = require('passport-facebook-token').Strategy;

//passport.use(new FacebookTokenStrategy({
//    clientID: 'APP_ID_GOES_HERE',
//    clientSecret: 'APP_SECRET_GOES_HERE'
//}, function(accessToken, refreshToken, profile, done) {
//    console.log(profile);
//    done(err, user);
//})
//});


exports.create_a_new_identity = function(req, callback) {
    //extend access token
    var accessToken = req.body.auth_result;
    var provider    = req.params['provider_name'];

    extend_access_token(provider, accessToken);
    get_and_index_user_data(provider, accessToken);
    //post to facebook to get the user data

    var new_identity = new Identity(req.body).save();
    return {done: true};
};

function extend_access_token(provider, accessToken){
    Restler
};

function get_and_index_user_data(provider, accessToken){
    Restler.get(GLOBAL.FACEBOOK_GRAPH_URL + 'me?fields=id,name')
};