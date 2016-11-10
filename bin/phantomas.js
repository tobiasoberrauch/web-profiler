const fs = require('fs');
const url = 'https://www.casual-fashion.com';
const reportPath = './data/report';
const phantomas = require('phantomas');

phantomas(url, {
    runs: 5
}, function (err, data) {
    var file = reportPath + '/phantomas.json';
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
});