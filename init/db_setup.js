var mongoose                = require('mongoose');

sanger_mongo_hosts          = SANGER_CONFIG['mongodb']['hosts'];
SANGER_MONGO_CONN           = mongoose.createConnection(sanger_mongo_hosts);


mongoose.connection.on('error', function() {
    GenericError('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
});
