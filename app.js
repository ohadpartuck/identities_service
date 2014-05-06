ROOT = __dirname;
ENV  = (process.env.NODE_ENV || 'DEVELOPMENT').toLowerCase();

var express         = require('express'),
    app             = express();

require('./init/app_setup')(app);
require('./init/global_methods/global_methods');
require('./init/db_setup');
require('./init/routes_setup')(app);
require('./init/passport/passport_setup');

app.listen(9001, function(){ console.log("live and kicking on port 9001")});


module.exports = app;