"use strict";

var restify = require('restify');
var validator = require('validator');

var fs = require('fs');
var exec = require('child_process').exec;

var config = require('./config');

var server = restify.createServer({
    certificate: config['ssl'].certificate || undefined,
    key: config['ssl'].key || undefined,
    name: 'Kana API'
});
server.listen(process.env.PORT || config['http'].port || 2333,
    process.env.ADDR || config['http'].addr || '::', function() {
        console.log('%s listening at %s', server.name, server.url);
});



function getTrackerPid(callback) {
    exec('pidof opentracker', function (err, stdout) {
        if (err) {
            console.error('Failed to get opentracker PID:\n' + err);
            return callback(err, null);
        }
        if (stdout) {
            // FIXME what if there are more than one opentracker process?
            callback(null, validator.trim(stdout));
        }
    }
};

function addToWhitelist(infoHash, callback) {
    fs.appendFile(config['tracker'].infohash_whitelist, infoHash + '\n', function(err) {
        if (err) {
            console.error('Failed to append infoHash to whitelist file:\n' + err);
        }
        callback(err);
    });
};

function reloadTracker() {
    exec('kill -HUP `pidof opentracker`', function (err) {
        if (err) {
            console.error('Failed to reload opentracker:\n' + err);
        }
    });
};
