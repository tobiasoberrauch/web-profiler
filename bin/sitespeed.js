const fs = require('fs');
const reportPath = './data/report';
const SiteSpeed = require('sitespeed.io');
const siteSpeed = new SiteSpeed();


siteSpeed.run({
    sites: [url],
    resultBaseDir: reportPath + '/sitespeed'
}, function (err, data) {
    var file = reportPath + '/sitespeed.json';
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
});