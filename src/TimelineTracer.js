const fs = require('fs');
const TimelineMetrics = require('./TimelineMetrics');
const TimelineModel = require('devtools-timeline-model');

class TimelineTracer {
    constructor(config) {
        let defaultConfig = {
            url: 'http://www.google.com',
            directory: 'profiles/',
            fileNamePrefix: 'profile-'
        };
        this.categories = ["-*", "devtools.timeline", "disabled-by-default-devtools.timeline", "disabled-by-default-devtools.timeline.frame", "toplevel", "blink.console", "disabled-by-default-devtools.timeline.stack", "disabled-by-default-devtools.screenshot", "disabled-by-default-v8.cpu_profile"];

        this.config = config || defaultConfig;
        this.rawEvents = [];

        this.timelineMetrics = new TimelineMetrics(this.config);
    }

    run(chrome) {
        chrome.Page.enable();
        chrome.Tracing.start({
            categories: this.categories.join(','),
            options: "sampling-frequency=10000"
        });

        chrome.Page.navigate({
            url: this.config.url
        });
        chrome.Page.loadEventFired(() => chrome.Tracing.end());

        chrome.Tracing.tracingComplete(() => {
            var fileName = this.config.directory + this.config.fileNamePrefix + 'trace.raw.json';
            fs.writeFileSync(fileName, JSON.stringify(this.rawEvents, null, 2));

            console.log('Saved raw data: ' + fileName);

            this.timelineMetrics.report();

            let timelineModel = new TimelineModel(this.rawEvents);
            // console.log(timelineModel.tracingModel());
            
            chrome.close();
        });

        chrome.Tracing.dataCollected((data) => {
            this.rawEvents = this.rawEvents.concat(data.value);
            this.timelineMetrics.onData(data.value)
        });
    }
}

module.exports = TimelineTracer;