var fs = require('fs-extra');
var assets = require('../scripts/assets.js');
var data = require('../scripts/data.js');
var config = require('../package.json').config;

config.specs =  {
    'deploy': process.argv.slice(2)[0] == 'true' ? true : false,
    'build': process.argv.slice(2)[1] ? process.argv.slice(2)[1] : 'preview',
    'modified': process.argv.slice(2)[2] ? process.argv.slice(2)[2] : 'none'
};
config.path = '.build/';
config.version = 'v/' + Date.now();
config.absolutePath = config.specs.deploy === false ? 'http://localhost:' + config.local.port : config.remote.url + '/' + config.remote.path + '/' + config.version;
config.data = data(config);

assets.compile(config);
