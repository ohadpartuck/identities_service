//var identity    = require(GLOBAL.ROOT + '/lib/identities/identities.js');

module.exports = function (app) {
    app.namespace('/identity/:provider', function(){
        app.get('/', function (req, res, _) {
            res.json({iasdfasdfasdf: 'index'});
        });

        app.post('/new', function (req, res, _) {
            res.json({iasdfasdfasdf: 'index'});
        });
    });

};