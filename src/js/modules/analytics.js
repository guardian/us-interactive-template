var initialized = false;

export default {
    event: function(category, action) {
        if (window.ga) {
            if (!initialized) {
                window.ga('create', 'UA-78705427-1', 'auto');
                window.ga('set', 'dimension3', 'theguardian.com');
                initialized = true;
            }

            window.ga('send', 'event', 'interactives', category, action);
        }
    }
};
