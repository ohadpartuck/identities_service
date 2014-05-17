var passport    = require('passport');


/**
 * POST /login
 * Sign in using email and password.
 * @param email
 * @param password
 */

exports.postLogin = function(req, res, next) {
    loginValidations(req, res);

    passport.authenticate('local', function(err, user, info) {
        if (err) return next(err);
        if (!user) {
            res.json({error: info.message});
            next(info.message)
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            res.json({msg: 'Success! You are logged in.', error: null, user: user});
        });
    })(req, res, next);
};



/**
 * GET /logout
 * Log out.
 */

exports.logout = function(req, res) {
    req.logout();
    res.json({result: 'Successfully logged out.'})
};

// Private Methods

function loginValidations(req, res){
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password cannot be blank').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.json({errors: errors});
    }
}