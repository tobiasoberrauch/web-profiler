#!/usr/bin/env node

const launcher = require('browser-launcher');

launcher(function (err, launch) {
    if (err) {
        return console.error(err);
    }
    // XDEBUG_SESSION=PHPSTORM

    let url = 'http://www.casual-fashion.dev';
    let opts = {
        browser: 'chrome',
        options: ['--remote-debugging-port=9222', '--disable-hang-monitor']
    };
    launch(url, opts, function (err) {
        if (err) {
            return console.error(err);
        }


    });

});
