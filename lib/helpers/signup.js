/**
 * POST /signup
 * Create a new local account.
 * @param email
 * @param password
 */

exports.postSignup = function(req, res, next, User) {
    signupValidations(req, res);

    var user = new User({
        email: req.body.email,
        password: req.body.password
    });

    User.findOne({ email: req.body.email }, function(err, existingUser) {
        if (existingUser) {
            res.json({error: 'Account with that email address already exists.'});
        }
        user.save(function(err) {
            if (err) return next(err);
            req.logIn(user, function(err) {
                if (err) return next(err);
                res.json({msg: 'you are logged in', error: null});
            });
        });
    });
};


// Private Methods

function signupValidations(req, res){
    req.assert('email', 'Email is not valid').isEmail();

    var errors = req.validationErrors();

    if (errors) {
        res.json({errors: errors});
    }
}