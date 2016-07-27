// http://codetonics.com/javascript/layout-thrashing/
var fs = require('fs');
var util = require('util');

class LayoutThrashingTracer {
    constructor(config) {
        this.config = config;
        this.rawEvents = [];
        this.categories = ['-*', 'devtools.timeline', 'disabled-by-default-devtools.timeline', 'disabled-by-default-devtools.timeline.stack'];
    }

    run(chrome) {
        chrome.Page.enable();
        chrome.Tracing.start({
            categories: this.categories.join(',')
        });

        chrome.Page.navigate({
            url: this.config.url
        });

        chrome.Page.loadEventFired(_ => chrome.Tracing.end());

        chrome.Tracing.dataCollected(data => {
            this.rawEvents = this.rawEvents.concat(data.value);
        });

        chrome.Tracing.tracingComplete(() => {
            var forcedReflowEvents = this.rawEvents
                .filter(e => e.name == 'UpdateLayoutTree' || e.name == 'Layout')
                .filter(e => e.args && e.args.beginData && e.args.beginData.stackTrace && e.args.beginData.stackTrace.length);

            var fileName = this.config.directory + this.config.fileNamePrefix + 'reflow.json';
            fs.writeFileSync(fileName, JSON.stringify(forcedReflowEvents, null, 2));
            console.log('Saved layout thrashing tracer: ' + fileName);

            chrome.close();
        });
    }
}

module.exports = LayoutThrashingTracer;