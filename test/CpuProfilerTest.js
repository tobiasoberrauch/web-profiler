
const launcher = require('browser-launcher');
const Chrome = require('chrome-remote-interface');
const CpuProfiler = require('../src/CpuProfiler');
const config = {
    url: 'https://www.casual-fashion.com/de_de',
    directory: 'profiles/',
    fileNamePrefix: 'cf-'
};


launcher(function (err, launch) {
    if (err) {
        return console.error(err);
    }

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
                const cpuProfiler = new CpuProfiler(config);
                cpuProfiler.run(chrome);
            });
        }, 1000);
    });


});
