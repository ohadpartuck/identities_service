//comm
var Identity =  require(GLOBAL.ROOT + '/app/models/identity.js');
var graph = require('fbgraph');
//var authUrl = graph.getOauthUrl({
//    "client_id":     GLOBAL.CLIENT_ID
//});
graph.setAppSecret(GLOBAL.CLIENT_SECRET);
var options = {
    timeout:  3000
    , pool:     { maxSockets:  Infinity }
    , headers:  { connection:  "keep-alive" }
};


exports.create_a_new_identity = function(req, callback) {
    //extend access token
    var accessToken = req.body.auth_result;
    var user_id     = req.body.user_id;
    var provider    = req.params['provider_name'];

    graph.setAccessToken(accessToken);
    extend_access_token(accessToken);
    get_and_index_user_data(user_id);
    get_user_likes(accessToken);

    return {done: true};
};

function extend_access_token(accessToken){
    graph.extendAccessToken({
        "access_token":    accessToken,
        "client_id":       GLOBAL.CLIENT_ID,
        "client_secret":   GLOBAL.CLIENT_SECRET
    }, function (err, facebookRes) {
        console.log('extend_response is ' + JSON.stringify(facebookRes));
    });

};

function get_and_index_user_data(user_id){
    graph.get(user_id, function(err, user_data) {
        save_to_db(user_data);
        index_that_shit(user_data);
    });
};

function save_to_db(user_data){
    //check if doesn't exists
    console.log('save to db %j' + user_data);
};

function index_that_shit(user_data){
    console.log('index_that_shit %j' + JSON.stringify(user_data));
};

function get_user_likes(accessToken){
    graph.get('likes', {limit: 2, access_token: accessToken}, function(err, user_likes) {
        console.log("user_likes %j" + JSON.stringify(user_likes));

    });
};


