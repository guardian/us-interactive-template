var config = require('../scripts/config.json');
var fs = require('fs-extra');

if (config.remote.path === 'atoms/2018/01/us-interactive-template') {
    var pathByFolder = __dirname.split('/');
    var projectName = pathByFolder[pathByFolder.length - 2];
        projectName = projectName.replace('interactive-', '').replace('main-media-', '');

    var now = new Date();
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var year = now.getFullYear();

    if (projectName !== 'us-template') {
        config.remote.path = 'atoms/' + year + '/' + month + '/' + projectName;
        fs.writeFileSync('./scripts/config.json', JSON.stringify(config, null, 4));
    }
}
