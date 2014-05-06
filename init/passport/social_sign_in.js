var passport                = require('passport');
var FacebookStrategy        = require('passport-facebook').Strategy;
var social_config           = require('../../configuration/main/social_config')[ENV];


/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a <provider> id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

// Sign in with Facebook.

passport.use(new FacebookStrategy(social_config.facebook, function(req, accessToken, refreshToken, profile, done) {
    //TODO - pass a different User Model every time
    if (req.user) {
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
            if (existingUser) {
                req.json({ msg: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
//                done(err);
            } else {
                User.findById(req.user.id, function(err, user) {
                    user.facebook = profile.id;
                    user.tokens.push({ kind: 'facebook', accessToken: accessToken });
                    user.profile.name = user.profile.name || profile.displayName;
                    user.profile.gender = user.profile.gender || profile._json.gender;
                    user.profile.picture = user.profile.picture || 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
                    user.save(function(err) {
                        req.json({ msg: 'Facebook account has been linked.' });
//                        done(err, user);
                    });
                });
            }
        });
    } else {
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
            if (existingUser) return done(null, existingUser);
            User.findOne({ email: profile._json.email }, function(err, existingEmailUser) {
                if (existingEmailUser) {
                    req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.' });
                    done(err);
                } else {
                    var user = new User();
                    user.email = profile._json.email;
                    user.facebook = profile.id;
                    user.tokens.push({ kind: 'facebook', accessToken: accessToken });
                    user.profile.name = profile.displayName;
                    user.profile.gender = profile._json.gender;
                    user.profile.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
                    user.profile.location = (profile._json.location) ? profile._json.location.name : '';
                    user.save(function(err) {
                        done(err, user);
                    });
                }
            });
        });
    }
}));