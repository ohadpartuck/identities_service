ROOT = __dirname;
ENV  = (process.env.NODE_ENV || 'DEVELOPMENT').toLowerCase();

var express         = require('express'),
    app             = express();

require('./init/app_setup')(app);
require('./init/routes_setup')(app);

app.listen(9001, function(){ console.log("live and kicking on port 9001")});


module.exports = app;