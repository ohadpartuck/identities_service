var passport                = require('passport');
var FacebookStrategy        = require('passport-facebook').Strategy;
var social_config           = require('../../configuration/main/social_config')[ENV];
var userSchema = require('../../app/models/user_schema');

User = SANGER_MONGO_CONN.model('User', userSchema);


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
//                msgs.push({info: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
                done(err, existingUser);
            } else {
                User.findById(req.user.id, function(err, user) {
                    user.facebook = profile.id;
                    user.tokens.push({ kind: 'facebook', accessToken: accessToken });
                    user.profile.name = user.profile.name || profile.displayName;
                    user.profile.gender = user.profile.gender || profile._json.gender;
                    user.profile.picture = user.profile.picture || 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
                    user.save(function(err) {
//                        msgs.push({ info: 'Facebook account has been linked.' });
                        done(err, user);
                    });
                });
            }
        });
    } else {
        findOrCreateUser(profile, profile._json.email, done, accessToken);
    }
}));


function findOrCreateUser(profile, email, done, accessToken){
    User.findOne({ facebook: profile.id }, function(err, existingUser) {
        if (existingUser) return done(null, existingUser);
        User.findOne({ email: email }, function(err, existingEmailUser) {
            if (existingEmailUser) {
//                msgs.push({ info: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.' });
                done(err, existingEmailUser);
            } else {
                var user = new User();
                user.email = email;
                user.facebook = profile.id;
                user.tokens.push({ kind: 'facebook', accessToken: accessToken });
                user.profile.name = profile.displayName;
                user.profile.gender = profile._json.gender;
                user.profile.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
                user.profile.location = (profile._json.location) ? profile._json.location.name : '';
                user.save(function(err) {
//                        done(err, user);
                });
                //not waiting for saving in Mongo
                done(null, user);
            }
        });
    });
}