var package = require('../package.json');
var fs = require('fs-extra');

if (package.config.remote.path === 'atoms/2018/01/us-interactive-template') {
    var pathByFolder = __dirname.split('/');
    var projectName = pathByFolder[pathByFolder.length - 2];
        projectName = projectName.replace('interactive-', '').replace('main-media-', '');

    var now = new Date();
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var year = now.getFullYear();

    if (projectName !== 'us-template') {
        console.log('changing remote destination');
        package.config.remote.path = 'atoms/' + year + '/' + month + '/' + projectName;
        fs.writeFileSync('package.json', JSON.stringify(package, null, 4));
    }
}
