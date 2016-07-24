const http = require('http');
const util = require('util');
const events = require('events');
const notifyChrome = require('chrome-remote-interface');
const ChromeProtocolService = require('./ChromeProtocolService');

class ChromeService extends events.EventEmitter {
    constructor() {
        super();

        this.options = {
            host: '',
            port: '',
            protocol: '',
            chooseTab: function (tabs) {
                return 0;
            }
        };
        this.currentCommandId = 0;
        this.chromeProtocolService = new ChromeProtocolService();
    }

    static prepareHelp(type, object) {
        var help = {
            'type': type
        };
        for (let field of object.keys()) {
            help[field] = object[field];
        }
        return help;
    }

    inspect(options) {
        options.customInspect = false;
        return util.inspect(this, options);
    }

    send() {
        let commandId = this.getCommandId();

    }

    close() {

    }

    getCommandId()
    {
        return ++this.currentCommandId;    
    }   
    
    
    addCommand(domainName, command) {
        var chromeService = this;

        chromeService[domainName][command.name] = function (params, callback) {
            chromeService.send(domainName + '.' + command.name, params, callback);
        };
        chromeService[domainName][command.name].help = ChromeService.prepareHelp('command', command);
    }

    addEvent(domainName, event) {
        var chromeService = this;

        chromeService[domainName][event.name] = function (handler) {
            chromeService.on(domainName + '.' + event.name, handler);
        };
        chromeService[domainName][event.name].help = ChromeService.prepareHelp('event', event);
    }

    addType(domainName, type) {
        this[domainName][type.id] = type;
    }

    addCommandShorthands() {
        for (let domain of this.protocol.domains) {
            let domainName = domain.domain;

            for (let command of domain.commands) {
                this.addCommand(domainName, command);
            }
            for (let event of domain.events) {
                this.addEvent(domainName, event);
            }
            for (let type of domain.types) {
                this.addType(domainName, type);
            }
        }
    }

    connect() {
        // this.getProtocol().then(function (protocol) {
        //
        // });
        this.addCommandShorthands();

        this.getTab(0).then(function (tab) {
            let url = tab.webSocketDebuggerUrl;

            this.webSocket = this.createWebSocket(url);
        })
    }

    createWebSocket(url) {
        let webSocket = new WebSocket(url);

        webSocket.on('open', function () {
            // self.notifier.emit('connect', self);
        });
        webSocket.on('message', function (data) {
            var message = JSON.parse(data);
            // command response
            if (message.id) {
                var callback = self.callbacks[message.id];
                if (callback) {
                    if (message.result) {
                        callback(false, message.result);
                    } else if (message.error) {
                        callback(true, message.error);
                    }
                    // unregister command response callback
                    delete self.callbacks[message.id];
                    // notify when there are no more pending commands
                    if (Object.keys(self.callbacks).length === 0) {
                        self.emit('ready');
                    }
                }
            }
            // event
            else if (message.method) {
                self.emit('event', message);
                self.emit(message.method, message.params);
            }
        });
        webSocket.on('error', function (err) {
            self.notifier.emit('error', err);
        });

        return webSocket;
    }

    notify(notifier) {
        notifyChrome(this.options, notifier);
    }

    getProtocol(cb) {
        let chromeProtocolService = this.chromeProtocolService;

        return this.getVersion().then(function (info) {
            let webKitVersion = info['WebKit-Version'];

            chromeProtocolService.download(webKitVersion, cb);
        });
    }

    getTab(index) {
        return new Promise(function (fulfill, reject) {
            this.getTabs().then(function (tabs) {
                let tab = tabs[index];
                if (!tab) {
                    reject();
                }

                if (!tab.webSocketDebuggerUrl) {
                    reject();
                }

                fulfill(tab);
            });
        });
    }

    getTabs() {
        return this.requestDevTools('list');
    }

    create(url) {
        return this.requestDevTools('new/?' + url);
    }

    activate(id) {
        return this.requestDevTools('activate/' + id);
    }

    close(id) {
        return this.requestDevTools('close/' + id);
    }

    getVersion() {
        return this.requestDevTools('version');
    }

    requestDevTools(path) {
        let options = this.options;
        options.path = '/json/' + path;

        return new Promise(function (fulfill, reject) {
            var request = http.get(options, function (response) {
                var data = '';
                response.on('data', function (chunk) {
                    data += chunk;
                });
                response.on('end', function () {
                    if (response.statusCode == 200) {
                        fulfill(null, JSON.parse(data));
                    } else {
                        reject(new Error(data));
                    }
                });
            });
            request.on('error', function (err) {
                reject(err);
            });
        });
    }
}

module.exports = ChromeService;