class Page {
    constructor(id, url, chrome, fetchContent) {
        this.id = id;
        this.url = url;
        this.chrome = chrome;
        this.fetchContent = fetchContent;
        this.failed = false;
        this.originalRequestId = undefined;
        this.originalRequestMs = undefined;
        this.domContentEventFiredMs = undefined;
        this.loadEventFiredMs = undefined;
        this.objects = {};
    }

    isFinished() {
        return this.failed || (typeof this.originalRequestMs !== 'undefined' &&
            typeof this.domContentEventFiredMs !== 'undefined' &&
            typeof this.loadEventFiredMs !== 'undefined');
    }

    isFailed() {
        return this.failed;
    }

    markAsFailed() {
        this.failed = true;
    }

    processMessage() {
        var id;
        switch (message.method) {
            case 'Page.domContentEventFired':
                this.domContentEventFiredMs = message.params.timestamp * 1000;
                break;
            case 'Page.loadEventFired':
                this.loadEventFiredMs = message.params.timestamp * 1000;
                break;
            default:
                if (message.method.match(/^Network\./)) {
                    id = message.params.requestId;
                    switch (message.method) {
                        case 'Network.requestWillBeSent':
                            // the first is the original request
                            if (typeof this.originalRequestId === 'undefined' &&
                                message.params.initiator.type === 'other') {
                                this.originalRequestMs = message.params.timestamp * 1000;
                                this.originalRequestId = id;
                            }
                            this.objects[id] = {
                                'requestMessage': message.params,
                                'responseMessage': undefined,
                                'responseLength': 0,
                                'encodedResponseLength': 0,
                                'responseFinished': undefined,
                                'responseBody': undefined,
                                'responseBodyIsBase64': undefined
                            };
                            break;
                        case 'Network.dataReceived':
                            if (id in this.objects) {
                                this.objects[id].responseLength += message.params.dataLength;
                                this.objects[id].encodedResponseLength += message.params.encodedDataLength;
                            }
                            break;
                        case 'Network.responseReceived':
                            if (id in this.objects) {
                                this.objects[id].responseMessage = message.params;
                            }
                            break;
                        case 'Network.loadingFinished':
                            if (id in this.objects) {
                                this.objects[id].responseFinished = message.params.timestamp;
                                // asynchronously fetch the request body (no check is
                                // performed to really ensure that the fetching is over
                                // before finishing this page processing because there is
                                // the PAGE_DELAY timeout anyway; it should not be a problem...)
                                if (this.fetchContent) {
                                    this.chrome.Network.getResponseBody({'requestId': id}, function (error, response) {
                                        if (!error) {
                                            this.objects[id].responseBody = response.body;
                                            this.objects[id].responseBodyIsBase64 = response.base64Encoded;
                                        }
                                    });
                                }
                            }
                            break;
                        case 'Network.loadingFailed':
                            // failure of the original request aborts the whole page
                            if (id === this.originalRequestId) {
                                this.failed = true;
                            }
                            break;
                    }
                }
        }
    }

    getObjects() {
        return this.objects;
    }
}

module.exports = Page;