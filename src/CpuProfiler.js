const fs = require('fs');

class CpuProfiler {
    constructor(config) {
        this.config = config;
    }

    run(chrome) {
        chrome.Page.enable();
        chrome.Profiler.enable();
        chrome.Profiler.setSamplingInterval({
            interval: 100
        });
        chrome.Profiler.start();

        chrome.Page.navigate({
            url: this.config.url
        });
        chrome.Page.loadEventFired(() => chrome.Profiler.end());
        
        chrome.Profiler.consoleProfileFinished((parameters) => {
            var fileName = this.config.directory + this.config.fileNamePrefix + '.cpuprofile.json';
            var data = JSON.stringify(parameters.profile, null, 2);
            fs.writeFileSync(fileName, data);

            console.log('Saved cpi profile: ' + fileName);
            chrome.close();
        });
    }
}

module.exports = CpuProfiler;