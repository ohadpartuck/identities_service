var passport        = require('passport');

module.exports = function (router, namespace) {

    router.get(namespace + '/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
    router.get(namespace + '/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
        res.json({})
    });

    return router;
};