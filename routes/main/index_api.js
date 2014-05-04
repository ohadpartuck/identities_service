var express = require('express');
var router = express.Router();

module.exports = function (app, namespace) {
    router.get('/', function(req, res) {
        res.json({'main route': 123456});
    });
    router.get('/ping', function(req, res) {
        res.json({'result': 'pong, motherfucker.'});
    });

    app.use(namespace + '/', router);
};

