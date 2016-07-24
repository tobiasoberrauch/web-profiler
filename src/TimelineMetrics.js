const fs = require('fs');
const Timer = require('./Timer');


class TimelineMetrics {
    constructor() {
        this.timelineMetrics = {};
        this.eventStacks = {};
    }
    onData(events) {
        events.forEach((event) =>
            this.processTracingRecord_(event)
        )
    }
    report(file){
        var filename = file + '.summary.json';

        var arr = Object.keys(tm.timelineMetrics).map(k => {
            var obj = {};
            obj[k] = tm.timelineMetrics[k];
            return obj;
        }).sort((a,b) =>
            b[Object.keys(b)].sum - a[Object.keys(a)].sum
        );

        var data = JSON.stringify(arr, null, 2);
        fs.writeFileSync(filename, data);

        console.log('Recording Summary: ' + filename);
    }
    addSummaryData_(e, source) {
        if (typeof this.timelineMetrics[e.type] === 'undefined') {
            this.timelineMetrics[e.type] = new Timer();
        }
        this.timelineMetrics[e.type].add(e.startTime && e.endTime ? e.endTime - e.startTime : 0);
    }
    processTracingRecord_(e) {
        switch (e.ph) {
            case 'I': // Instant Event
            case 'X': // Duration Event
                var duration = e.dur || e.tdur || 0;
                this.addSummaryData_({
                    type: e.name,
                    data: e.args ? e.args.data : {},
                    startTime: e.ts / 1000,
                    endTime: (e.ts + duration) / 1000
                }, 'tracing');
                break;
            case 'B': // Begin Event
                if (typeof this.eventStacks[e.tid] === 'undefined') {
                    this.eventStacks[e.tid] = [];
                }
                this.eventStacks[e.tid].push(e);
                break;
            case 'E': // End Event
                if (typeof this.eventStacks[e.tid] === 'undefined' || this.eventStacks[e.tid].length === 0) {
                    debug('Encountered an end event that did not have a start event', e);
                } else {
                    var b = this.eventStacks[e.tid].pop();
                    if (b.name !== e.name) {
                        debug('Start and end events dont have the same name', e, b);
                    }
                    this.addSummaryData_({
                        type: e.name,
                        data: Object.assign(e.args.endData, b.args.beginData),
                        startTime: b.ts / 1000,
                        endTime: e.ts / 1000
                    }, 'tracing');
                }
                break;
        }
    }
}



module.exports = TimelineMetrics;