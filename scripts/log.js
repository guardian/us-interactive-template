var request = require('sync-request');
var config = require('../scripts/config.json');

var specs =  {
    'build': process.argv.slice(2)[0] ? process.argv.slice(2)[0] : 'preview'
};


var res = request('GET', 'http://interactive.guim.co.uk/' + config.remote.path + '/' + specs.build + '.log');

console.log('\n' + res.getBody().toString());
