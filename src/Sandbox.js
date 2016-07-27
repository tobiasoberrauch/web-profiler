class Sandbox {
    constructor(config) {
        let defaultConfig = {
            url: 'http://www.google.com',
            directory: 'profiles/',
            fileNamePrefix: 'profile-'
        };
        this.config = config || defaultConfig;
    }

    run(chrome) {
        chrome.Network.enable();
        chrome.Page.enable();

        chrome.on('Network.requestWillBeSent', (message) => {
            console.log(message);
        });
        chrome.on('Network.responseReceived', (message) => {
            console.log(message);
        });
        chrome.on('Network.loadEventFired', (message) => {
            console.log(message);
        });

        chrome.Network.canEmulateNetworkConditions(() => {
            chrome.Network.emulateNetworkConditions({
                // offline: true,
                latency: 100000
                // downloadThroughput: 1000,
                // uploadThroughput: 1000
            }, () => {
                chrome.Page.navigate({
                    url: this.config.url
                });
            });
        });

        chrome.Network.setCacheDisabled(true);

    }
}

module.exports = Sandbox;