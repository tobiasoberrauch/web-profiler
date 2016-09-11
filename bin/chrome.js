
const launcher = require('browser-launcher');
const Chrome = require('chrome-remote-interface');

launcher(function (err, launch) {
    if (err) {
        return console.error(err);
    }

    let options = {
        browser: 'chrome',
        options: ['--remote-debugging-port=9222', '--disable-hang-monitor']
    };
    launch(url, options, function (err) {
        if (err) {
            return console.error(err);
        }

        Chrome({
            host: 'localhost',
            port: 9222
        }, chrome => {
            const timeLineTracer = new TimelineTracer(chrome, {
                directory: reportPath + '/'
            });
            timeLineTracer.run(url, function (err, data) {

            });
        });
    });
});