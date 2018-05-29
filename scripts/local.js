// dependancies
var watch = require('node-watch');
var cmd = require('node-cmd');
var static = require('node-static');
var config = require('../scripts/config.json');

watch('src', function(file) {
    var fileExt = file.substring(file.lastIndexOf('.') + 1);
    var isAssets = file.includes('/assets/');

    if (isAssets) {
        console.log('updating static assets');
        cmd.get('npm run compile -- local static', function(data) { console.log(data); });
    } else if (fileExt === 'html' || fileExt === 'svg') {
        console.log('updating html');
        cmd.get('npm run compile -- local html', function(data) { console.log(data); });
    } else if (fileExt === 'scss') {
        console.log('updating css');
        cmd.get('npm run compile -- local css', function(data) { console.log(data); });
    } else if (fileExt === 'js') {
        console.log('updating js');
        cmd.get('npm run compile -- local js', function(data) { console.log(data); });
    } else {
        console.log('non-watchable file extension changed :' + fileExt);
    }
});

var file = new static.Server('./.build', {
    'cache': 0,
    'headers': {
        'Access-Control-Allow-Origin': '*'
    }
});

console.log('Preview available at http://localhost:' + config.local.port + '/index.html')

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(config.local.port);