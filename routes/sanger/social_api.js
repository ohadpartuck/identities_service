var passport        = require('passport');

module.exports = function (router, namespace) {

//    router.get(namespace + '/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
    router.post(namespace + '/auth/:providerName/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
        res.json({auth: req.params.providerName})
    });

    return router;
};