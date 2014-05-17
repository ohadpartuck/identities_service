//TODO - all these function - extract to a helper node module
var crypto = require('crypto');
var passport   = require('passport');


isProduction                = function() { return ENV == 'production' };
useStub                     = function(use_stub_setting) { return use_stub_setting && !isProduction() };
GenericError                = function(msg){
    console.error(msg);
};
GenericOnGetError           = function(params){
    //TODO - catch all errors not here but by emitting an event
    console.log('GenericOnGetError got this ' + JSON.stringify(params));
};
genericNewObjectCallback    = function(params){
    console.log('genericNewObjectCallback got this ' + JSON.stringify(params));
};
sanitizeObject = function(queryObj, legalProductsKeys){
    var sanitizedObj = {};

    for (var key in queryObj){
        if (legalKey(key, legalProductsKeys)){
            sanitizedObj[key] = queryObj[key];
        }
    }

    return sanitizedObj;
};
objectToUrlString = function(queryObj, legalProductsKeys){
    sanitizedObj =  sanitizeObject(queryObj, legalProductsKeys);

    return queryString.stringify(sanitizedObj);
};
legalKey = function (key, legalProductsKeys){
    return legalProductsKeys.hasOwnProperty(key)
};
sanitizedUrlIsOk = function (sanitizedUrl){
    //To prevent get all query in production
    return !(sanitizedUrl == '' && isProduction());
};

sanitizedNewProductParamsIsOk = function(sanitizedNewProductParams, mustFields){
    var paramsLegal = true;
    for (var key in mustFields){
        if (!sanitizedNewProductParams.hasOwnProperty(key)){
            paramsLegal = false
        }
    }
    return paramsLegal;
};

/**
 * Get URL to a user's gravatar.
 * Used in Navbar and Account Management page.
 */
initial_gravatar = function(email, size, defaults){
    if (!size) size = 200;
    if (!defaults) defaults = 'retro';

    if (!this.email) {
        return 'https://gravatar.com/avatar/?s=' + size + '&d=' + defaults;
    }

    var md5 = crypto.createHash('md5').update(email);
    return 'https://gravatar.com/avatar/' + md5.digest('hex').toString() + '?s=' + size + '&d=' + defaults;
};

socialSignInMiddleware = function(req, res, next){
    passport.authenticate(req.params.providerName, {assignProperty: 'user'})
};