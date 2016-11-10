const fs = require('fs');
const WebPageTest = require('webpagetest');
const webPageTest = new WebPageTest('www.webpagetest.org');
const url = 'https://www.casual-fashion.com/de_de';


const options = {
    key: 'A.176408efee07131b32ea8ad1147cc673',

    connectivity: 'DSL',        // Cable|DSL|FIOS|Dial|3G|3GFast|Native|custom
    runs: 5,
    video: true,
    label: 'casual-fashion.com - ',
    tcpdump: true, //  capture network packet trace (tcpdump)
    bodies: true, // save response bodies for text resources
    notify: 't.oberrauch@simplicity.ag',
    full: true,
    htmlbody: true,
    //pingback: 'http://performence.tog.ag/results',


// chrome only
    timeline: true,
    callstack: 5,
    chrometrace: true,
    netlog: true,

};
webPageTest.runTest(url, options, function (err, response) {
    if (err) {
        return console.error(err);
    }

    let testId = response.data.testId;

    fs.mkdirSync('./test/wbt/' + testId + '/');

    let file = './test/wbt/' + testId + '/test.json';
    fs.writeFileSync(file, JSON.stringify(response.data, null, 2));

    webPageTest.getTestStatus(testId, function (err, response) {
        let file = './test/wbt/' + testId + '/status.json';
        fs.writeFileSync(file, JSON.stringify(response.data, null, 2));
    });
});