#!/usr/bin/env node

const TimelineTracer = require('./src/TimelineTracer');
const Chrome = require('chrome-remote-interface');
const launcher = require('browser-launcher');

const config = {
    url: 'https://www.casual-fashion.com/de_de',
    directory: 'profiles/',
    fileNamePrefix: 'cf-'
};

launcher(function (err, launch) {
    if (err) {
        return console.error(err);
    }

    // console.log('# available browsers:');
    // console.dir(launch.browsers);

    var opts = {
        browser: 'chrome',
        options: ['--remote-debugging-port=9222', '--disable-hang-monitor']
    };
    launch(config.url, opts, function (err, ps) {
        if (err) {
            return console.error(err);
        }

        setTimeout(function () {
            Chrome(function (chrome) {
                const timelineTracer = new TimelineTracer(config);
                timelineTracer.run(chrome);
            });
        }, 1000);

    });
});
