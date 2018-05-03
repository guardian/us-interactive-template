var fs = require('fs-extra');
var handlebars = require('handlebars');
var browserify = require('browserify');
var stringify = require('stringify');
var sass = require('node-sass');
var deasync = require('deasync');
var glob = require('glob-fs')({ gitignore: true });
var markdown = require('markdown').markdown;

module.exports = {
    js: function(path, fileName, absolutePath) {
        fs.removeSync(path + '/' + fileName + '.js');

        var isDone = false;

        browserify('./src/js/' + fileName + '.js').transform(stringify, {
            appliesTo: { includeExtensions: ['.hjs', '.html', '.whatever'] }
        }).bundle(function(err, buf) {
            if (err) {
                console.log(err);
            }
            fs.writeFileSync(path + '/' + fileName + '.js', buf.toString().replace(/@@assetPath@@/g, absolutePath));
            isDone = true;
            console.log('updated js!');
        });

        deasync.loopWhile(function() {
            return !isDone;
        });
    },

    css: function(path, absolutePath) {
        fs.removeSync(path + '/main.css');

        var css = sass.renderSync({
            file: 'src/sass/main.scss'
        }).css.toString('utf8');

        fs.writeFileSync(path + '/main.css', css.replace(/@@assetPath@@/g, absolutePath));
        console.log('updated css!');
    },

    html: function(path, absolutePath, data) {
        fs.removeSync(path + '/main.html');

        handlebars.registerHelper('if_eq', function(a, b, opts) {
            if (a == b) {
                return opts.fn(this);
            } else {
                return opts.inverse(this);
            }
        });

        handlebars.registerHelper('marked', function(string) {
            return markdown.toHTML(string);
        });

        handlebars.registerHelper('inc', function(value, options) {
            return parseInt(value) + 1;
        });

        handlebars.registerHelper('loop', function(from, to, inc, block) {
                block = block || {fn: function () { return arguments[0]; }};

                var data = block.data || {index: null};

                var output = '';
                for (var i = from; i <= to; i += inc) {
                    data['index'] = i;
                    output += block.fn(i, {data: data});
                }

                return output;
        });

        handlebars.registerHelper('if_even', function(conditional, options) {
         if((conditional % 2) == 0) {
           return options.fn(this);
         } else {
           return options.inverse(this);
         }
        });

        handlebars.registerHelper('if_odd', function(conditional, options) {
         if((conditional % 2) !== 0) {
           return options.fn(this);
         } else {
           return options.inverse(this);
         }
        });

        handlebars.registerHelper('match-number', function(index) {
            return (index + 2) / 2;
        });

        var html = fs.readFileSync('src/templates/main.html', 'utf8');
        var template = handlebars.compile(html);

        var partials = glob.readdirSync('src/templates/**/*.*');

        partials.forEach(function(partial) {
            var name = partial.replace('src/templates/', '').split('.')[0];
            var template = fs.readFileSync(partial, 'utf8');

            handlebars.registerPartial(name, template);
        });

        fs.writeFileSync(path + '/main.html', template(data).replace(/@@assetPath@@/g, absolutePath));
        console.log('updated html!');
    },

    preview: function(path, isDeploy, assetPath) {
        var guardianHtml = fs.readFileSync('./scripts/immersive.html', 'utf8');
        var guardianTemplate = handlebars.compile(guardianHtml);

        var compiled = guardianTemplate({
            'html': fs.readFileSync(path + '/main.html'),
            'js': fs.readFileSync(path + '/main.js')
        });

        if (isDeploy) {
            var re = new RegExp(assetPath,'g');
            compiled = compiled.replace(re, 'assets');
        }

        fs.writeFileSync(path + '/index.html', compiled);

        console.log('built page preview');
    }
} 