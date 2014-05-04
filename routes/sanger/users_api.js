module.exports = function (router, namespace) {
    router.get(namespace + '/ab', function(req, res) {
        res.json({'users_main': 123});
    });

    return router;
};