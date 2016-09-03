#!/usr/bin/env node

const fs = require('fs');
const Sitespeed = require('sitespeed.io');


let sitespeed = new Sitespeed();
sitespeed.run({
    sites: [
        'https://www.casual-fashion.com'
    ],
    resultBaseDir: 'data/sitespeed'
}, function (err, data) {
    var file = './data/sitespeed/sitespeed-' + Date.now() + '.json';
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
});