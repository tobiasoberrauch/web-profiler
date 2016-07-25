const fs = require('fs');
const merge = require('object-merge');
const Timer = require('./Timer');


class TimelineMetrics {
    constructor(config) {
        let defaultConfig = {
            url: 'http://www.google.com',
            directory: 'profiles/',
            fileNamePrefix: 'profile-'
        };

        this.config = config || defaultConfig;

        this.timelineMetrics = {};
        this.eventStacks = {};
    }
    onData(events) {
        events.forEach((event) => this.processTracingRecord(event))
    }
    report(){
        var fileName = this.config.directory + this.config.fileNamePrefix + 'trace.json';

        var arr = Object.keys(this.timelineMetrics).map(key => {
            var obj = {};
            obj[key] = this.timelineMetrics[key];
            return obj;
        }).sort((a,b) => {
            return b[Object.keys(b)].sum - a[Object.keys(a)].sum;
        });

        var data = JSON.stringify(arr, null, 2);
        fs.writeFileSync(fileName, data);

        console.log('Saved recording summary: ' + fileName);
    }
    addSummaryData(e, source) {
        if (typeof this.timelineMetrics[e.type] === 'undefined') {
            this.timelineMetrics[e.type] = new Timer();
        }
        this.timelineMetrics[e.type].add(e.startTime && e.endTime ? e.endTime - e.startTime : 0);
    }
    processTracingRecord(event) {
        switch (event.ph) {
            case 'I': // Instant Event
            case 'X': // Duration Event
                var duration = event.dur || event.tdur || 0;
                this.addSummaryData({
                    type: event.name,
                    data: event.args ? event.args.data : {},
                    startTime: event.ts / 1000,
                    endTime: (event.ts + duration) / 1000
                }, 'tracing');
                break;
            case 'B': // Begin Event
                if (typeof this.eventStacks[event.tid] === 'undefined') {
                    this.eventStacks[event.tid] = [];
                }
                this.eventStacks[event.tid].push(event);
                break;
            case 'E': // End Event
                if (typeof this.eventStacks[event.tid] === 'undefined' || this.eventStacks[event.tid].length === 0) {
                    debug('Encountered an end event that did not have a start event', event);
                } else {
                    var b = this.eventStacks[event.tid].pop();
                    if (b.name !== event.name) {
                        debug('Start and end events dont have the same name', event, b);
                    }
                    this.addSummaryData({
                        type: event.name,
                        data: merge(event.args.endData, b.args.beginData),
                        startTime: b.ts / 1000,
                        endTime: event.ts / 1000
                    }, 'tracing');
                }
                break;
        }
    }
}



module.exports = TimelineMetrics;