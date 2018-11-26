const article = 'A good\, short\, descriptor of the interactive';
let hasAnalytics = false;
let gaTracker;

export default {
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
