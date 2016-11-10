const fs = require('fs');
const WebPageTest = require('webpagetest');
const webPageTest = new WebPageTest('www.webpagetest.org');
const connect = require('connect');
const http = require('http');
const url = 'https://www.casual-fashion.com/de_de';

var app = connect();

var compression = require('compression');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var ngrok = require('ngrok');


app.use(compression());
app.use(cookieSession({
    keys: ['secret1', 'secret2']
}));
app.use(bodyParser.json());

app.use(function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var data = JSON.stringify({
        param: req.param,
        body: req.body
    }, null, 2);
    fs.writeFileSync('./data/debug/' + new Date().getTime() + '.json', data);
    res.end(data);
});

http.createServer(app).listen(3000, '127.0.0.1', function () {
    ngrok.connect({
        addr: 3000
    }, function (err, callbackUrl) {
        if (err) {
            return console.error(err);
        }

        console.log('callbackUrl', callbackUrl);

        run(callbackUrl);
    });
});


function run(callbackUrl) {
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
        pingback: callbackUrl,
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
}