var WebPagetest = require('webpagetest'),
    os          = require('os'),
    url         = require('url'),
    http        = require('http');

var wpt = new WebPagetest('my-wpt-server.com');

// local server to listen for test complete
var server = http.createServer(function (req, res) {
    var uri = url.parse(req.url, true);

    res.end();

    // get test results
    if (uri.pathname === '/testdone' && uri.query.id) {
        server.close(function() {
            wpt.getTestResults(uri.query.id, function (err, data) {
                // print page fully loaded time
                console.log(data.response.data.average.firstView.fullyLoaded);
            });
        });
    }
});

// run test for my Twitter profile page
wpt.runTest('http://twitter.com/marcelduran', {
    firstViewOnly: true,
    pingback: url.format({
        protocol: 'http',
        hostname: os.hostname(),
        port: 8080,
        pathname: '/testdone'
    })
}, function(err, data) {
    // listen for test complete (pingback)
    server.listen(8080);
});