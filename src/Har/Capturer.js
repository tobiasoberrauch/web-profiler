// https://github.com/cyrus-and/chrome-har-capturer/blob/master/lib/client.js

const Page = require('./Page');

class Capturer {
    constructor(urls, options) {
        this.urls = urls;
        this.options = options;
        this.pages = new Map();
    }

    run(chrome) {
        let capturer = this;

        chrome.Page.enable();
        chrome.Network.enable();
        chrome.Network.setCacheDisabled({'cacheDisabled': true});
        if (typeof options.userAgent === 'string') {
            chrome.Network.setUserAgentOverride({'userAgent': options.userAgent});
        }
        // start!
        chrome.once('ready', function () {
            capturer.loadUrl(0);
        });
    }

    loadUrl(index) {
        let next = function () {
            clearTimeout(giveUpTimeout);
            common.dump('--- End: ' + url);
            self.emit(page.isFailed() ? 'pageError' : 'pageEnd', url);
            chrome.removeAllListeners('event');
            // start the next URL after a certain delay
            // so to "purge" any spurious requests
            setTimeout(function () {
                loadUrl(index + 1);
            }, PAGE_DELAY);
        };

        let loadEventTimeout;
        let giveUpTimeout;
        let url = this.urls[index];
        let page = new Page(index, url, chrome, this.options.fetchContent);

        this.pages.set(index, page);


    }
}