var loginOrOut = require('../../lib/helpers/login'),
    signup     = require('../../lib/helpers/signup'),
//    forgotPass = require('../../lib/helpers/forgot_pass'),
    passport = require('passport');
    userSchema = require('../../app/models/user_schema');

User = SANGER_MONGO_CONN.model('User', userSchema);

module.exports = function (router, namespace) {
    router.post(namespace + '/login', function(req, res, next) {
        loginOrOut.postLogin(req, res, next);
    });

    router.get(namespace + '/logout', function(req, res) {
        loginOrOut.logout(req, res);
    });

    router.post(namespace + '/signup', function(req, res, next) {
        signup.postSignup(req, res, next, User);
    });

//    router.get(namespace + '/forgot', function(req, res) {
//        forgotPass.getForgot(req, res, User);
//    });
//
//    router.post(namespace + '/forgot', function(req, res, next) {
//        forgotPass.postForgot(req, res, next, User);
//    });
//
//    router.post(namespace + '/reset/:token', function(req, res) {
//        res.json({'reset_token_post': true});
//    });

    //TODO - make this a general route for all social (couldn't do it with socialSignInMiddleware)
    router.get(namespace + '/auth/facebook/callback', passport.authenticate('facebook', {assignProperty: 'user'}), function(req, res) {
        res.json({auth: 'facebook', user: req['user']})
    });

//    router.get(namespace + '/auth/twitter/callback',  passport.authenticate('twitter', {assignProperty: 'user'}), function(req, res) {
//        res.json({auth: 'twitter', user: req['user']})
//    });


    return router;
};