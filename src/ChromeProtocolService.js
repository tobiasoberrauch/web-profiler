const https = require('https');
const util = require('util');

class ChromeProtocolService {
    constructor() {
        this.fallbackProtocol = require('../data/protocol.json');
    }

    download(version, cb) {
        let chromeProtocolService = this;

        var match = version.match(/\s\(@(\b[0-9a-f]{5,40}\b)/);
        var hash = match[1];
        var fromChromiumDotOrg = (hash <= 202666);
        var template = (fromChromiumDotOrg ?
            'https://src.chromium.org/blink/trunk/Source/devtools/protocol.json?p=%s' :
            'https://chromium.googlesource.com/chromium/src/+/%s/third_party/WebKit/Source/devtools/protocol.json?format=TEXT');
        var url = util.format(template, hash);

        var request = https.get(url, function (response) {
            var data = '';
            response.on('data', function (chunk) {
                data += chunk;
            });
            response.on('end', function () {
                if (response.statusCode === 200) {
                    try {
                        // the file is served base64 encoded from googlesource.com
                        if (!fromChromiumDotOrg) {
                            data = new Buffer(data, 'base64').toString();
                        }
                        cb(null, JSON.parse(data));
                    } catch (err) {
                        cb(null, chromeProtocolService.fallbackProtocol);
                    }
                } else {
                    cb(null, chromeProtocolService.fallbackProtocol);
                }
            });
        });
        request.on('error', function () {
            cb(null, chromeProtocolService.fallbackProtocol);
        });
    }
}

module.exports = ChromeProtocolService;