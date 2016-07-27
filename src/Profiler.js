const async = require('async');
const bigrig = require('bigrig');
const Chrome = require('chrome-remote-interface');
const TimelineTracer = require('./TimelineTracer');
const launcher = require('browser-launcher');
const findPort = require("find-free-port");

const config = {
    directory: 'profiles/',
    fileNamePrefix: 'cf-'
};

class Profiler {
    constructor() {
        this.config = {
            host: 'localhost',
            port: 9222
        };
    }

    getBrowserConfig() {
        return {
            browser: 'chrome',
            options: ['--remote-debugging-port=' + this.config.port, '--disable-hang-monitor']
        };
    }

    bootstrap(postTasks, cb) {
        let tasks = [
            (next) => {
                findPort(9222, 9500, next);
            },
            (port, next) => {
                this.config.port = port;
                launcher(next)
            },
            (launch, next) => {
                launch('https://www.casual-fashion.com', this.getBrowserConfig(), next)
            },
            (ps, next) => {
                Chrome(this.config, (chrome) => {
                    next(null, chrome);
                });
            }
        ].concat(postTasks);

        async.waterfall(tasks, cb);
    }

    static createAnalyser() {
        let profiler = new Profiler();

        return function (url, cb) {
            profiler.bootstrap([
                profiler.createTimelineTracer(url),
                profiler.createTraceAnalyser()
            ], cb);
        }
    }

    createTimelineTracer(url) {
        return function (chrome, next) {
            const timeLineTracer = new TimelineTracer(chrome, config);
            timeLineTracer.run(url, next);
        }
    }

    createTraceAnalyser() {
        return function (rawEvents, next) {
            next(null, bigrig.analyze(rawEvents));
        }
    }
}

module.exports = Profiler;