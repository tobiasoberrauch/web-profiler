const CpuProfiler = require('../src/CpuProfiler');

class CpuProfilerTest {
    constructor(testRunner) {

    }

    setUp() {
        this.config = {
            url: 'https://www.casual-fashion.com/de_de',
            directory: 'profiles/',
            fileNamePrefix: 'cf-'
        };
    }

    tearDown() {

    }

    testRun(chrome) {
        const cpuProfiler = new CpuProfiler(this.config);
        cpuProfiler.run(chrome);
    }
}

module.exports = CpuProfilerTest;