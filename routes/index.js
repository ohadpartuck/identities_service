
module.exports = function (app) {
    app.get('/ping', function (req, res, next) {
        res.json({result: 'pong'});
    });
};

