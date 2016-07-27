const fs = require('fs');
const TimelineMetrics = require('./TimelineMetrics');
const merge = require('object-merge');

class TimelineTracer {
    constructor(chrome, config) {
        let defaultConfig = {
            directory: 'profiles/',
            fileNamePrefix: 'profile-',
            categories: [
                "-*",
                "devtools.timeline",
                "disabled-by-default-devtools.timeline",
                "disabled-by-default-devtools.timeline.frame",
                "toplevel",
                "blink.console",
                "disabled-by-default-devtools.timeline.stack",
                "disabled-by-default-devtools.screenshot",
                "disabled-by-default-v8.cpu_profile"
            ]
        };
        this.config = merge(defaultConfig, config);

        this.chromeRuntime = chrome;
        this.rawEvents = [];

        this.timelineMetrics = new TimelineMetrics(this.config);
    }

    run(url, next) {
        this.chromeRuntime.Page.enable();
        this.chromeRuntime.Tracing.start({
            categories: this.config.categories.join(','),
            options: "sampling-frequency=10000"
        });

        this.chromeRuntime.Page.navigate({
            url: url
        });
        this.chromeRuntime.Page.loadEventFired(() => this.chromeRuntime.Tracing.end());

        this.chromeRuntime.Tracing.tracingComplete(() => {
            var fileName = this.config.directory + this.config.fileNamePrefix + 'trace.raw.json';
            var data = JSON.stringify(this.rawEvents, null, 2);
            fs.writeFileSync(fileName, data);

            console.log('Saved raw data: ' + fileName);

            this.timelineMetrics.report();
            
            this.chromeRuntime.close();

            next(null, data);
        });

        this.chromeRuntime.Tracing.dataCollected((data) => {
            this.rawEvents = this.rawEvents.concat(data.value);
            this.timelineMetrics.onData(data.value)
        });
    }
}

module.exports = TimelineTracer;