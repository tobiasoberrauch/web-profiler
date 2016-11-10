const fs = require('fs');
const url = 'https://www.casual-fashion.com';
const reportPath = './data/report';
const pageSiteInsights = require('psi');
const tooManyImages = require('tmi');


pageSiteInsights(url).then(data => {
    var file = reportPath + '/pagesiteinsights.json';
    fs.writeFileSync(file, JSON.stringify(data, null, 2));

    tooManyImages().process({
        verbose: true
    }, data);
});