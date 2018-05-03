// dependancies
var watch = require('node-watch');
var cmd = require('node-cmd');
var static = require('node-static');
var config = require('../scripts/config.json');

watch('src', function(file) {
    var fileExt = file.substring(file.lastIndexOf('.') + 1);

    if (fileExt === 'html' || fileExt === 'svg') {
        console.log('updating html');
        cmd.get('npm run compile -- local preview html', function(data) { console.log(data); });
    } else if (fileExt === 'scss') {
        console.log('updating css');
        cmd.get('npm run compile -- local preview css', function(data) { console.log(data); });
    } else if (fileExt === 'js') {
        console.log('updating js');
        cmd.get('npm run compile -- local preview js', function(data) { console.log(data); });
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

console.log('serving embedded atom at http://localhost:' + config.local.port + '/index.html')
console.log('serving the raw atom at http://localhost:' + config.local.port + '/main.html');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(config.local.port);