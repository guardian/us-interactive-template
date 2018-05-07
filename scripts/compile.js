var handlebars = require('handlebars');
var fs = require('fs-extra');
var cmd = require('node-cmd');
var deploy = require('./deploy.js');
var config = require('../scripts/config.json');
var assets = require('../scripts/helpers/assets.js');
var getData = require('../scripts/helpers/data.js');

var specs =  {
    'deploy': process.argv.slice(2)[0] == 'true' ? true : false,
    'build': process.argv.slice(2)[1] ? process.argv.slice(2)[1] : 'preview',
    'modified': process.argv.slice(2)[2] ? process.argv.slice(2)[2] : 'none'
};

if (config.data.id !== "") {
    var getData = require('../scripts/helpers/data.js');
    var data = getData();
} else {
    data = {};
}

var path = '.build/';
var version = 'v/' + Date.now();
var assetPath = specs.deploy === false ? 'http://localhost:' + config.local.port : config.remote.url + '/' + config.remote.path + '/' + version;

fs.mkdirsSync(path);

if (specs.modified === 'html') {
    assets.html(path, assetPath, data);
} else if (specs.modified === 'js') {
    assets.js(path, 'main', assetPath);
    assets.js(path, 'app', assetPath);
} else if (specs.modified === 'css') {
    assets.css(path, assetPath);
} else if (specs.modified === 'static') {
    assets.static(path, assetPath)
} else {
    assets.html(path, assetPath, data);
    assets.css(path, assetPath);
    assets.js(path, 'main', assetPath);
    assets.js(path, 'app', assetPath);
    assets.static(path);
}

if (specs.deploy === false) {
    assets.preview(path, specs.deploy, assetPath);
} else if (specs.deploy) {
    fs.emptyDirSync('.deploy');
    fs.copySync(path, '.deploy/' + version);
    fs.writeFileSync('.deploy/' + specs.build, version);
    deploy();
}
