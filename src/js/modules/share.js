const pageUrl = window.location.href.split('#')[0],
    shareCopy = $('meta[property=og\\:title]').attr('content');

export default {
    init: function() {
        this.setLinks('.uit-share');
    },

    setLinks: function(parent) {
        $(parent + ' .uit-share__button--twitter a').attr('href', this.getTwitterLink());
        $(parent + ' .uit-share__button--facebook a').attr('href', this.getFacebookLink());
        $(parent + ' .uit-share__button--email a').attr('href', this.getEmailLink());
    },

    getTwitterLink: function() {
        return 'https://twitter.com/intent/tweet?text=' + encodeURI(shareCopy) +
                '&url=' + encodeURIComponent(pageUrl + '?CMP=share_btn_tw');
    },

    getFacebookLink: function() {
        return 'https://www.facebook.com/dialog/share?app_id=180444840287&href=' + encodeURIComponent(pageUrl + '?CMP=share_btn_fb');
    },

    getEmailLink: function() {
        return 'mailto:?subject=' + encodeURIComponent(shareCopy) +
                '&body=' + encodeURIComponent(pageUrl + '?CMP=share_btn_link');
    }
};
