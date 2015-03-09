"use strict";

var restify = require('restify');
var config = require('./config');

var server = restify.createServer();
server.listen(process.env.PORT || config.port || 2333,
    process.env.ADDR || config.addr || '::', function() {
        console.log('%s listening at %s', server.name, server.url);
});