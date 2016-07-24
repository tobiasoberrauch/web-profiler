// http://codetonics.com/javascript/layout-thrashing/
var fs = require('fs');
var util = require('util');

class LayoutThrashingTracer {
    run(chrome) {
        var url = 'http://paulirish.com';
        var rawEvents = [];
        var trace_categories = ['-*', 'devtools.timeline', 'disabled-by-default-devtools.timeline', 'disabled-by-default-devtools.timeline.stack'];

        chrome.Page.enable();
        chrome.Tracing.start({categories: trace_categories.join(',')});

        chrome.Page.navigate({url: url});

        chrome.Page.loadEventFired(_ => chrome.Tracing.end());

        chrome.Tracing.dataCollected(data => {
            rawEvents = rawEvents.concat(data.value);
        });

        chrome.Tracing.tracingComplete(function () {
            var forcedReflowEvents = rawEvents
                .filter(e => e.name == 'UpdateLayoutTree' || e.name == 'Layout')
                .filter(e => e.args && e.args.beginData && e.args.beginData.stackTrace && e.args.beginData.stackTrace.length)

            console.log('Found events:', util.inspect(forcedReflowEvents, {
                showHidden: false, depth: null
            }), '\n');

            console.log('Results: (', forcedReflowEvents.length, ') forced style recalc and forced layouts found.\n')

            var file = 'forced-reflow-' + Date.now() + '.devtools.trace';
            fs.writeFileSync(file, JSON.stringify(rawEvents, null, 2));
            console.log('Found events written to file: ' + file);

            chrome.close();
        });
    }
}

module.exports = LayoutThrashingTracer;