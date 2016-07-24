const fs = require('fs');
const TimelineMetrics = require('./TimelineMetrics');

var TRACE_CATEGORIES = ["-*", "devtools.timeline", "disabled-by-default-devtools.timeline", "disabled-by-default-devtools.timeline.frame", "toplevel", "blink.console", "disabled-by-default-devtools.timeline.stack", "disabled-by-default-devtools.screenshot", "disabled-by-default-v8.cpu_profile"];
var rawEvents = [];

class TimelineTracer {
    constructor() {
        this.timelineMetrics = new TimelineMetrics();
    }

    run(chrome) {
        chrome.Page.enable();
        chrome.Tracing.start({
            "categories": TRACE_CATEGORIES.join(','),
            "options": "sampling-frequency=10000"  // 1000 is default and too slow.
        });

        chrome.Page.navigate({'url': 'http://paulirish.com'});
        chrome.Page.loadEventFired(function () {
            chrome.Tracing.end()
        });

        chrome.Tracing.tracingComplete(function () {
            var file = 'profile-' + Date.now() + '.devtools.trace';
            fs.writeFileSync(file, JSON.stringify(rawEvents, null, 2));
            console.log('Trace file: ' + file);
            console.log('You can open the trace file in DevTools Timeline panel. (Turn on experiment: Timeline tracing based JS profiler)\n');

            this.timelineMetrics.report(file);

            chrome.close();
        });

        chrome.Tracing.dataCollected(function (data) {
            var events = data.value;
            rawEvents = rawEvents.concat(events);

            // this is just extra but not really important
            this.timelineMetrics.onData(events)
        });


    }
}

module.exports = TimelineTracer;