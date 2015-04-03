"use strict";

var restify = require('restify');
var validator = require('validator');

var fs = require('fs');
var exec = require('child_process').exec;

var config = require('./config');

var server = restify.createServer({
    name: 'Kana API'
});
server.listen(process.env.PORT || config['http'].port || 2333,
    process.env.ADDR || config['http'].addr || '::', function() {
        console.log('%s listening at %s', server.name, server.url);
});

server.use(restify.bodyParser());

server.use(checkIdent);

server.post('/add', function(req, res) {
    var infoHash = req.params.infoHash + '';
    var r = new RegExp(/([A-F\d]{40})/i);
    if (r.test(infoHash)) {
        addToWhitelist(infoHash, function(err) {
            if (err) {
                return res.send(500, 'Internal Server Error');
            } else {
                reloadTracker();
                res.send(200, 'infoHash Updated');
            }
        });
    } else {
        res.send(400, 'Bad Request');
    }
})

function checkIdent(req, res, next) {
    var ip = req.headers['x-forwarded-for'].split(',')[0] || req.connection.remoteAddress;
    var key = req.params.key + '';
    if (config['security'].ip_whitelist.indexOf(ip) !== -1 && key === config['security'].api_key) {
        next();
    } else {
        return next(new restify.ForbiddenError("You are not allowed to do so."));
    }
};

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
    });
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
