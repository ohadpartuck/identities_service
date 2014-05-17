/**
 * POST /signup
 * Create a new local account.
 * @param email
 * @param password
 */

exports.postSignup = function(req, res, next, User) {
    signupValidations(req, res, next);

    var user = new User({
        email: req.body.email,
        password: req.body.password,
        profile: {picture: initial_gravatar(req.body.email, 60)}
    });

    User.findOne({ email: req.body.email }, function(err, existingUser) {
        if (existingUser) {
            res.json({error: 'Account with that email address already exists.'});
        }
        user.save(function(err) {
            if (err) return next(err);
            req.logIn(user, function(err) {
                if (err) return next(err);
                res.json({msg: 'you are logged in', error: null, user: user});
            });
        });
    });
};


// Private Methods

function signupValidations(req, res, next){
    req.assert('email', 'Email is not valid').isEmail();

    var errors = req.validationErrors();

    if (errors) {
        res.json({errors: errors});
        next();
    }
}