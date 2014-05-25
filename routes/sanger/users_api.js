var userSchema = require('../../app/models/user_schema');
var User = MAIN_MONGO_CONN.model('User', userSchema);

module.exports = function (router, namespace) {
    return setupDefaultsRoutes(router, namespace, User);
};