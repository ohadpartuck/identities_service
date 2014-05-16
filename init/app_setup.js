var global_constants         = require('global_constants'),
    extend                   = require('util')._extend,
    bodyParser               = require('body-parser'),
    queryString              = require('querystring'),
    passport                 = require('passport'),
    expressValidator         = require('express-validator');


module.exports = function (app) {

    MAIN_CONFIG          = require('../configuration/main/' + ENV + '.json')    ;

    SANGER_CONFIG        = require_settings('sanger');

    SANGER_CONSTATNTS    = global_constants['sanger']['sanger_constants'];



    app.use(bodyParser());              //to get params in req.body
    app.use(passport.initialize());     //passport is for user authorization
    app.use(passport.session());        //passport is for user authorization - needed here ??
    app.use(expressValidator());        //params validations

};

//TODO - add localization

function require_settings(namespace){
    var defaults                = require('../configuration/' + namespace + '/defaults.json'),
        by_env                  = require('../configuration/' + namespace + '/' + ENV + '.json');
    return extend(defaults, by_env);
}



