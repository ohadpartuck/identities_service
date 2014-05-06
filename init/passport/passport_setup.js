var passport                = require('passport');
var LocalStrategy           = require('passport-local').Strategy;

// Sign in using Email and Password.

passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
    User.findOne({ email: email }, function(err, user) {
        if (!user) return done(null, false, { message: 'Email ' + email + ' not found'});
        user.comparePassword(password, function(err, isMatch) {
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Invalid email or password.' });
            }
        });
    });
}));


//TO log in and create user session?? maybe move this to the api service
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});


require('./social_sign_in');
