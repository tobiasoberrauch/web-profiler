const perfTool = require('devbridge-perf-tool');
const url = 'https://www.casual-fashion.com';
const reportPath = './data/report';

var options = {
    siteURL: url,
    sitePages: ['/de_de', '/de_de/opus'],
    runDevPerf: true,
    runGoogleSpeedTest: true,
    runHtmlTest: true,
    resultsFolder: reportPath + '/perf-tool'
};


perfTool.performance(options);