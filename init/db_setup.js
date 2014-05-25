var mongoose                = require('mongoose');

main_mongo_hosts          = MAIN_CONFIG['mongodb']['hosts'];
MAIN_MONGO_CONN           = mongoose.createConnection(main_mongo_hosts);


mongoose.connection.on('error', function() {
    GenericError('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
});
