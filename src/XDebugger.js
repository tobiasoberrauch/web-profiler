#!/usr/bin/env node

const launcher = require('browser-launcher');

class XDebugger {
    constructor(chrome) {
        this.runtime = chrome;
    }

    run() {
        // XDEBUG_SESSION=PHPSTORM
        let url = 'http://www.casual-fashion.dev/de_de/kasse/auftragserzeugung';

        this.runtime.Network.enable();
        this.runtime.Network.setExtraHTTPHeaders({
            Cookie: "cookieNotification=true; _vwo_uuid_v2=5B03C12A515C9CCE345FF719C1F32D14|6afc7521c1b509491c83f55c2f23c425; teh=cd95808da7aa1cbf0925d9a51cdb7b2c; exitBounce=true; checkoutEvent=true; teh2=79c2663a49d76cb08b36ebc98005c2b1; XDEBUG_SESSION=PHPSTORM; PHPSESSID=dmei08vcdomogvcoq1j00j2o31; zdt-hidden=0; overviewtype=Produkt; size_regular=9999; stillAlive=1469637632; testCookie=true"
        });
        this.runtime.Page.enable();
        this.runtime.Page.navigate({
            url: url
        });
        this.runtime.Page.loadEventFired(() => {
            console.log(arguments);
        });
    }
}

module.exports = XDebugger;