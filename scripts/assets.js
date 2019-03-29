var fs = require('fs-extra');
var handlebars = require('handlebars');
var sass = require('node-sass');
var deasync = require('deasync');
var glob = require('glob-fs')({ gitignore: true });
var markdown = require('markdown').markdown;
var rollup = require('rollup');
var resolve = require('rollup-plugin-node-resolve');
var terser = require('rollup-plugin-terser').terser;
var commonjs = require('rollup-plugin-commonjs');
var deploy = require('./deploy.js');

module.exports = {
    js: function(config, fileName) {
        fs.removeSync(config.path + '/' + fileName + '.js');
        let isDone = false;

        (async function () {
            let rollupOptions = {
                input: './src/js/' + fileName + '.js',
                plugins: [
                    resolve(),
                    commonjs({
                        namedExports: {
                            'node_modules/jquery/dist/jquery.min.js': [ 'jquery' ]
                        }
                    })
                ]
            };

            if (config.specs.deploy) {
                rollupOptions.plugins.push(terser());
            }

            var bundle = await rollup.rollup(rollupOptions);

            await bundle.write({
                file: config.path + '/' + fileName + '.js',
                format: 'iife',
                sourcemap: config.specs.deploy ? false : 'inline'
            });

            isDone = true;
        })()

        deasync.loopWhile(() => {
            return !isDone;
        });
    },

    css: function(config) {
        fs.removeSync(config.path + '/main.css');

        var isDone = false,
            css;

        sass.render({
            file: 'src/sass/main.scss'
        }, function(err, result) {
            if (err) {
                console.log(err);
            }
            fs.writeFileSync(config.path + '/main.css', result.css.toString('utf8').replace(/\{\{ path \}\}/g, config.absolutePath).replace(/\{\{path\}\}/g, config.absolutePath));
            isDone = true;
            console.log('Updated css!');
        });

        deasync.loopWhile(function() {
            return !isDone;
        });
    },

    html: function(config) {
        fs.removeSync(config.path + '/main.html');

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

        var adId = 0;

        handlebars.registerHelper('adId', function(context, options) {
            adId++;
            return adId;
        });

        handlebars.registerHelper('handlise', function(string) {
            if (string) {
                return string.replace(/ /g, '-').toLowerCase();
            }
        });

        handlebars.registerHelper('markedCap', function(string) {
            var markedIntro = markdown.toHTML(string);
            var intro = markedIntro.slice(3);
            var firstCharacter = intro.substring(0, 1);
                intro = intro.slice(1);

            return '<p><span class=\'uit-drop\'><span class=\'uit-drop__inner\'>' + firstCharacter + '</span></span>' + intro;
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

        fs.writeFileSync(config.path + '/main.html', template(config.data));
        console.log('Updated html!');
    },

    static: function(config) {
        fs.emptyDirSync(config.path + '/assets');
        fs.mkdirsSync(config.path + '/assets');
        fs.copySync('src/assets', config.path + '/assets');
        console.log('Updated static assets');
    },

    preview: function(config) {
        var guardianHtml = fs.readFileSync('./scripts/' + config.template + '.html', 'utf8');
        var guardianTemplate = handlebars.compile(guardianHtml);

        var compiled = guardianTemplate({
            'html': fs.readFileSync(config.path + 'main.html'),
            'js': fs.readFileSync(config.path + 'main.js'),
            'body': fs.readFileSync('./scripts/hybrid-body.html')
        });

        if (config.specs.deploy) {
            var re = new RegExp(assetPath,'g');
            compiled = compiled.replace(re, 'assets');
        }

        fs.writeFileSync(config.path + '/index.html', compiled);

        console.log('Built page preview');
    },

    finishUp: function(config) {
        if (config.specs.deploy === false) {
            this.preview(config);
        } else if (config.specs.deploy) {
            fs.emptyDirSync('.deploy');
            fs.copySync(config.path, '.deploy/' + config.version);
            fs.writeFileSync('.deploy/' + config.specs.build, config.version);
            deploy(config.specs.build);
        }

    },

    compile: function(config) {
        fs.mkdirsSync(config.path);

        var modified = config.specs.modified;

        if (modified === 'html') {
            this.html(config);
        } else if (modified === 'js') {
            this.js(config, 'main');
            this.js(config, 'app');
        } else if (modified === 'css') {
            this.css(config);
        } else if (modified === 'static') {
            this.static(config)
        } else {
            this.html(config);
            this.css(config);
            this.js(config, 'main');
            this.js(config, 'app');
            this.static(config);
        }

        this.finishUp(config);
    }
}
