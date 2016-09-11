#!/usr/bin/env node

const fs = require('fs');
const pageSiteInsights = require('psi');
const tooManyImages = require('tmi');
const phantomas = require('phantomas');
const apiBenchmark = require('api-benchmark');
const cssTriggers = require('css-triggers');
const perfTool = require('devbridge-perf-tool');

const Sitespeed = require('sitespeed.io');
const WebPageTest = require('webpagetest');
const StyleStats = require('stylestats');
const Profiler = require('./src/Profiler');
const TimelineTracer = require('./src/TimelineTracer');

let url = 'https://www.casual-fashion.com';

let mainStylesheet = 'data/casualFashion/css/style.css';
let stats = new StyleStats(mainStylesheet);
let sitespeed = new Sitespeed();
let webPageTest = WebPageTest('https://www.webpagetest.org');

let id = Date.now();
var reportPath = './data/report/' + id;
fs.mkdirSync(reportPath);

stats.parse(function (err, data) {
    var file = reportPath + '/css-stats.json';
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
});

cssTriggers(mainStylesheet, true, function (data) {
    var file = reportPath + '/css-triggers.json';
    fs.writeFileSync(file, data);
});

var Parker = require('parker/lib/Parker');
var metrics = require('parker/metrics/All');

fs.readFile(mainStylesheet, function (err, data) {
    if (err) throw err;

    var parker = new Parker(metrics);
    var results = parker.run(data.toString());

    var file = reportPath + '/css-report.json';
    fs.writeFileSync(file, JSON.stringify(results, null, 2));

    // Do something with results
});

sitespeed.run({
    sites: [url],
    resultBaseDir: reportPath + '/sitespeed'
}, function (err, data) {
    var file = reportPath + '/sitespeed.json';
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
});

phantomas(url, {
    runs: 5
}, function (err, data) {
    var file = reportPath + '/phantomas.json';
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
});

webPageTest.runTest(url, function (err, data) {
    var file = reportPath + '/webpagetest.json';
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
});

pageSiteInsights(url).then(data => {
    var file = reportPath + '/pagesiteinsights.json';
    fs.writeFileSync(file, JSON.stringify(data, null, 2));

    tooManyImages().process({
        verbose: true
    }, data);
});

var service = {
    cf: url
};

var routes = {
    de: '/de_de'
};
apiBenchmark.measure(service, routes, function (err, data) {
    if (err) {
        return console.error(err);
    }

    var file = reportPath + '/api-benchmark.json';
    fs.writeFileSync(file, JSON.stringify(data, null, 2));

    apiBenchmark.getHtml(data, function (err, html) {
        if (err) {
            return console.error(err);
        }

        fs.writeFileSync(reportPath + '/api-benchmark.html', html);
    });
});


var options = {
    siteURL: url,
    sitePages: ['/de_de', '/de_de/opus'],
    runDevPerf: true,
    runGoogleSpeedTest: true,
    runHtmlTest: true,
    resultsFolder: reportPath + '/perf-tool'
};
return perfTool.performance(options);