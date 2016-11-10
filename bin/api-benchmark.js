const apiBenchmark = require('api-benchmark');
const url = 'https://www.casual-fashion.com';
const reportPath = './data/report';


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
