var request = require('sync-request');
var fs = require('fs-extra');
var gsjson = require('google-spreadsheet-to-json');
var deasync = require('deasync');
var config = require('../../package.json').config;
var userHome = require('user-home');
var keys = require(userHome + '/.gu/interactives.json');

var data;

function fetchData(callback) {
    gsjson({
        spreadsheetId: config.data.id,
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

function sortResults(data) {
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

module.exports = function getData() {
    if (config.data.id !== "") {
        var isDone = false;

        fetchData(function(result) {
            data = result;
            data = sortResults(data);

            isDone = true;
        });

        deasync.loopWhile(function() {
            return !isDone;
        });

        return data;
    } else {
        return {};
    }
};
