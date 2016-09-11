var Rwdperf = require('rwdperf');

new Rwdperf({
    link: "http://google.com",
    mobile: true,
    emulateViewport: true,
    deviceScaleFactor: 1,
    scale: 1,
    width: 400,
    height: 500,
    userAgent: null,
    cb: handler
}).init();

function handler(err, data) {
    if ( err ) return console.log(err);

    // all worked out! do amazing stuff with the data...
    console.log(JSON.stringify(data));
}