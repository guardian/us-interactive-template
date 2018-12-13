var fs = require('fs-extra');
var deploy = require('./deploy.js');
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

data = data(config);

fs.mkdirsSync(config.path);

if (specs.modified === 'html') {
    assets.html(path, data);
} else if (specs.modified === 'js') {
    assets.js(path, 'main', data.path, specs.deploy);
    assets.js(path, 'app', data.path, specs.deploy);
} else if (specs.modified === 'css') {
    assets.css(path, data.path);
} else if (specs.modified === 'static') {
    assets.static(path)
} else {
    assets.html(path, data);
    assets.css(path, data.path);
    assets.js(path, 'main', data.path, specs.deploy);
    assets.js(path, 'app', data.path, specs.deploy);
    assets.static(path);
}

if (specs.deploy === false) {
    assets.preview(path, specs.deploy, data.path);
} else if (specs.deploy) {
    fs.emptyDirSync('.deploy');
    fs.copySync(path, '.deploy/' + version);
    fs.writeFileSync('.deploy/' + specs.build, version);
    deploy(specs.build);
}
