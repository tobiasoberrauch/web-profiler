class CpuProfiler {
    constructor() {

    }

    run (chrome) {
        chrome.Page.enable();
        chrome.Page.loadEventFired(function () {
            // on load we'll start profiling, kick off the test, and finish
            // alternatively, Profiler.start(), Profiler.stop() are accessible via chrome-remote-interface
            chrome.Runtime.evaluate({"expression": "console.profile(); startTest(); console.profileEnd();"});
        });

        chrome.Profiler.enable();
        chrome.Profiler.setSamplingInterval({
            interval: 100
        }, function () {
            chrome.Page.navigate({'url': 'http://localhost:8080/demo/perf-test.html'});
        });

        chrome.Profiler.consoleProfileFinished(function (parameters) {
            var file = 'profile-' + Date.now() + '.cpuprofile';
            var data = JSON.stringify(parameters.profile, null, 2);
            fs.writeFileSync(file, data);

            console.log('Done! See ' + file);
            chrome.close();
        });
    }
}

module.exports = CpuProfiler;