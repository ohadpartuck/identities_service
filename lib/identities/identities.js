//comm
var Identity =  require(GLOBAL.ROOT + '/app/models/identity.js');

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

};

function get_and_index_user_data(user_id){
};

function save_to_db(user_data){
    //check if doesn't exists
    console.log('save to db %j' + user_data);
};

function index_that_shit(user_data){
    console.log('index_that_shit %j' + JSON.stringify(user_data));
};

function get_user_likes(accessToken){

};


