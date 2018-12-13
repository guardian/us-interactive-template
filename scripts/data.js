var request = require('sync-request');
var fs = require('fs-extra');
var gsjson = require('google-spreadsheet-to-json');
var deasync = require('deasync');
var userHome = require('user-home');
var keys = require(userHome + '/.gu/interactives.json');

var data;

function fetchData(id, callback) {
    gsjson({
        spreadsheetId: id,
        allWorksheets: true,
        credentials: keys.google
    })
    .then(function(result) {
        callback(result);
    })
    .then(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function sortResults() {
    if (data.length === 1) {
        data = data[0]
    } else {
        data = {
            'sheet1': data[0],
            'sheet2': data[1]
        }
    }

    return data;
}

function appendConfigDrivenData(config) {
    data.path = config.specs.deploy === false ? 'http://localhost:' + config.local.port : config.remote.url + '/' + config.remote.path + '/' + config.version;
    data.isLocal = !config.specs.deploy;

    return data;
}

module.exports = function getData(config) {
    console.log(config);

    if (config.data.id !== "") {
        var isDone = false;

        fetchData(config.data.id, function(result) {
            data = result;
            data = sortResults();
            // call additional data cleaning functions here
            data = appendConfigDrivenData(config);

            isDone = true;
        });

        deasync.loopWhile(function() {
            return !isDone;
        });

        return data;
    } else {
        data = {};

        return appendConfigDrivenData(config);
    }
};
