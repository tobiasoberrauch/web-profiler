let TestRunner = require('./TestRunner');

let testRunner = new TestRunner();
testRunner.run([
    './CpuProfilerTest.js'
], (err, results) => {
    console.log(arguments);
});