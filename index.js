#!/usr/bin/env node

const fs = require('fs');
const async = require('async');

const WebPageTest = require('webpagetest');
const webPageTest = new WebPageTest('www.webpagetest.org');

function createFactory(method) {
    return function (callback) {
        webPageTest[method](testId, function (err, response) {
            console.log('cb', arguments);
            if (err) {
                return callback(err);
            }

            callback(null, response);
        });
    };
}

function run(testId) {
    async.parallel({
            status: createFactory('getTestStatus'),
            results: createFactory('getTestResults'),
            locations: createFactory('getLocations'),
            //harData: createFactory('getHARData'),
            utilizationData: createFactory('getUtilizationData'),
            requestData: createFactory('getRequestData'),

            //testers: createFactory('getTesters'),
            //pageSpeedData: createFactory('getPageSpeedData'),
            //timelineData: createFactory('getTimelineData'),


            //netLogData: createFactory('getNetLogData'),
            //chromeLogData: createFactory('getChromeTraceData'),
            //consoleLogData: createFactory('getConsoleLogData'),
            //testInfo: createFactory('getTestInfo'),
            //history: createFactory('getHistory'),
            //waterfallImage: createFactory('getWaterfallImage'),
            //screenshotImage: createFactory('getScreenshotImage'),
            //googleCsiData: createFactory('getGoogleCsiData'),
            //responseBody: createFactory('getResponseBody'),
            //embedVideoPlayer: createFactory('getEmbedVideoPlayer'),
        },
        function (err, results) {
            console.log('results', results);

            let file = './test/wbt/' + testId + '/results.json';
            fs.writeFileSync(file, JSON.stringify(results, null, 2));
        }
    );
}


let testId = '161110_6W_2KZN';
run(testId);