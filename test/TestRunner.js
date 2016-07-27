const fs = require('fs');
const async = require('async');
const launcher = require('browser-launcher');
const Chrome = require('chrome-remote-interface');

class TestRunner {
    constructor() {

    }

    run(testFilePaths, cb) {
        debugger;
        async.map(testFilePaths, (testFilePath, cb) => {
            const Test = require(testFilePath);
            let test = new Test(this);

            launcher((err, launch) => {
                if (err) {
                    return console.error(err);
                }

                let url = 'http://www.casual-fashion.dev';
                let browserConfig = {
                    browser: 'chrome',
                    options: ['--remote-debugging-port=9222', '--disable-hang-monitor']
                };
                launch(url, browserConfig, (err) => {
                    if (err) {
                        return console.error(err);
                    }

                    Chrome((chrome) => {
                        test.setUp();
                        test.testRun(chrome);
                        test.tearDown();

                        let result = {
                            'it is': 'great'
                        };
                        cb(null, result);
                    });
                });

            });
        }, cb);
    }
}

module.exports = TestRunner;