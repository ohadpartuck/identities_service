var passport                = require('passport');
var FacebookStrategy        = require('passport-facebook').Strategy;
//var TwitterStrategy         = require('passport-twitter').Strategy;
//var GitHubStrategy          = require('passport-github').Strategy;
//var GoogleStrategy          = require('passport-google-oauth').OAuth2Strategy;
//var LinkedInStrategy        = require('passport-linkedin-oauth2').Strategy;
//var InstagramStrategy       = require('passport-instagram').Strategy;
//var OAuthStrategy           = require('passport-oauth').OAuthStrategy; // Tumblr
//var OAuth2Strategy          = require('passport-oauth').OAuth2Strategy; // Venmo, Foursquare
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
    findOrCreateUser('facebook', profile, profile._json.email, done, accessToken);
}));

//passport.use(new TwitterStrategy(social_config.twitter, function(req, accessToken, refreshToken, profile, done) {
//    findOrCreateUser('twitter', profile, profile._json.email, done, accessToken);
//}));
//
//passport.use(new GitHubStrategy(social_config.github, function(req, accessToken, refreshToken, profile, done) {
//    findOrCreateUser('github', profile, profile._json.email, done, accessToken);
//}));
//
//passport.use(new LinkedInStrategy(social_config.linkedin, function(req, accessToken, refreshToken, profile, done) {
//    findOrCreateUser('github', profile, profile._json.emailAddress, done, accessToken);
//}));
//
//passport.use(new GoogleStrategy(social_config.google, function(req, accessToken, refreshToken, profile, done) {
//    findOrCreateUser('github', profile, profile._json.email, done, accessToken);
//}));
//
//passport.use(new GitHubStrategy(social_config.github, function(req, accessToken, refreshToken, profile, done) {
//    findOrCreateUser('github', profile, profile._json.email, done, accessToken);
//}));
//
//passport.use(new InstagramStrategy(social_config.instagram, function(req, accessToken, refreshToken, profile, done) {
//    findOrCreateUser('instagram', profile, profile._json.email, done, accessToken);
//}));
//

function findOrCreateUser(socialProvider, profile, email, done, accessToken){

    var SearchParams = GetSearchParams(socialProvider, profile.id);

    User.findOne(SearchParams, function(err, existingUser) {
        if (existingUser) return done(null, existingUser);

        User.findOne({ email: email }, function(err, existingEmailUser) {
            if (existingEmailUser) {
                //TODO - take picture from social if new user and he has the default gravatar
                done(err, existingEmailUser);
            } else {
                var user = new User();
                user.email = email;
                user[socialProvider] = profile.id;
                user.tokens.push({ kind: socialProvider, accessToken: accessToken });
                user.profile.name = profile.displayName;
                user.profile.gender = profile._json.gender;
                user.profile.picture = pictureUrlByProvider(email, profile, socialProvider);
                user.profile.location = (profile._json.location) ? profile._json.location.name : '';
                user.save(function(err) {});
                //not waiting for saving in Mongo
                done(null, user);
            }
        });
    });
}

function GetSearchParams(socialProvider, profile_id){
    var searchObject = {};
    searchObject[socialProvider] = profile_id;
    return searchObject;
}


function pictureUrlByProvider(email, profile, socialProvider){
    var url;
    switch (socialProvider){
        case 'facebook':
            url = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
            break;
        case 'twitter':
            url =  profile._json.profile_image_url;
            break;
        case 'github':
            url = profile._json.avatar_url;
            break;
        case 'google':
            url = profile._json.picture;
            break;
        case 'linkedin':
            url = profile._json.publicProfileUrl;
            break;
        case 'instagram':
            url = profile._json.data.profile_picture;
            break;
        default:
            url = initial_gravatar(email, 60);
            break;

    }
    return url;

}