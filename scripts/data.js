var request = require('sync-request');
var fs = require('fs-extra');
var gsjson = require('google-spreadsheet-to-json');
var deasync = require('deasync');
var userHome = require('user-home');

var data;

function fetchData(id, callback) {
    var keys = require(userHome + '/.gu/interactives.json');

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
    data.path = config.absolutePath
    data.isLocal = !config.specs.deploy;

    return data;
}

module.exports = function getData(config) {
    data = {};

    if (config.data.id !== "") {
        var isDone = false;

        fetchData(config.data.id, function(result) {
            data = result;
            data = sortResults();
            // call additional data cleaning functions here

            isDone = true;
        });

        deasync.loopWhile(function() {
            return !isDone;
        });
    }

    data = appendConfigDrivenData(config);

    return data;
};
