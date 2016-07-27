// https://github.com/pmdartus/snapline/blob/master/index.js

const ScreenshotService = require('../src/ScreenshotService');
const TestCase = require('./TestCase');

class ScreenshotServiceTest extends TestCase {
    test() {
        const config = {
            dataPath: './data/profiles/screenshots'
        };

        let screenshotService = new ScreenshotService(config);
        screenshotService.fromTimelineFile('./data/profiles/cf-trace.raw.json');
    }
}

let screenshotServiceTest = new ScreenshotServiceTest();
screenshotServiceTest.test();