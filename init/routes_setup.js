
module.exports = function (app) {
    require('../routes/main/index_api')(app, '');
    require('../routes/sanger/sanger_api')(app, '/sanger');
};

