const launcher = require('browser-launcher');
const Chrome = require('chrome-remote-interface');
const XDebugger = require('../src/XDebugger');
const config = {
    url: 'https://www.casual-fashion.com/de_de'
};

launcher((err, launch) => {
    if (err) {
        return console.error(err);
    }

    var browserOptions = {
        browser: 'chrome',
        options: ['--remote-debugging-port=9222', '--disable-hang-monitor']
    };

    launch(config.url, browserOptions, (err) => {
        if (err) {
            return console.error(err);
        }

        setTimeout(() => {
            Chrome((chrome) => {
                let xDebugger = new XDebugger(chrome);
                xDebugger.run(this.config.url);
            });
        }, 1000);
    });
});
