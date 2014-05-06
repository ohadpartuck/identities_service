var async             = require('async'),
    crypto            = require('crypto');

/**
 * GET /reset/:token
 * Reset Password page.
 */

exports.getForgot = function(req, res, User) {
    if (req.isAuthenticated()) {
        res.json({error: 'User already signed in'});
    }

    User
        .findOne({ resetPasswordToken: req.params.token })
        .where('resetPasswordExpires').gt(Date.now())
        .exec(function(err, user) {
            if (!user) {
                req.json({ error: 'Password reset token is invalid or has expired.', redirect: '/forgot' });
            }
            res.json({error:null, result:'success', action: 'we found the user, it\'s ok to render the reset password screen'});
        });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 * @param email
 */

exports.postForgot = function(req, res, next, User) {
    forgotValidations(req, res);

    async.waterfall([
        function(done) {
            crypto.randomBytes(16, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({ email: req.body.email.toLowerCase() }, function(err, user) {
                if (!user) {
                    req.json({ msg: 'No account with that email address exists.' });
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            //TODO - send mail (open a mail account in gmail for this purpose)
            req.json({ msg: 'An e-mail has been sent to ' + user.email + ' with further instructions. needs to be implemented' });
            done("", 'done');
//            var smtpTransport = nodemailer.createTransport('SMTP', {
//                service: 'SendGrid',
//                auth: {
//                    user: secrets.sendgrid.user,
//                    pass: secrets.sendgrid.password
//                }
//            });
//            var mailOptions = {
//                to: user.email,
//                from: 'support@starter.com',
//                subject: 'Reset your password on Hackathon Starter',
//                text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
//                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
//                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
//                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
//            };
//            smtpTransport.sendMail(mailOptions, function(err) {
//                req.json({ msg: 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
//                done(err, 'done');
//            });
        }
    ], function(err) {
        if (err) return next(err);
        res.json({error: err});
    });
};

function forgotValidations(req, res){
    req.assert('email', 'Please enter a valid email address.').isEmail();

    var errors = req.validationErrors();

    if (errors) {
       res.json({error: errors})
    }
}