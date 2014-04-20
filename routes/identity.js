var identity    = require(GLOBAL.ROOT + '/lib/identities/identities.js');

module.exports = function (app) {
    app.namespace('/identity/:provider_name', function(){
        app.post('/new', function (req, res, _) {
            res.json(identity.create_a_new_identity(req));
        });
    });

};