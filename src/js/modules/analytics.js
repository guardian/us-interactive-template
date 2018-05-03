var $ = require('../vendor/jquery.js');

var article = 'A good, short, descriptor of the interactive',
    hasAnalytics = false,
    gaTracker;

module.exports =  {
    init: function() {
        this.checkForAnalytics();
    },

    checkForAnalytics: function() {
        if (window.ga) {
            gaTracker = window.guardian.config.googleAnalytics.trackers.editorial;
            hasAnalytics = true;
        }
    },

    event: function() {
        if (hasAnalytics) {
            window.ga(gaTracker + '.send', 'event', category, action, article + ' | ' + label, value, {
                nonInteraction: true
            });
        }
    }
};
