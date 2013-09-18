var dnode = require('dnode'),
    TestCafe = require('testcafe').TestCafe;

exports.Server = function (cfg, port) {
    var testCafe = new TestCafe(cfg);

    var d = dnode({
        on: function (evtName, callback) {
            testCafe.on(evtName, callback);
        },

        listAvailableBrowsers: function (callback) {
            callback(testCafe.listAvailableBrowsers());
        },

        listConnectedWorkers: function (callback) {
            callback(testCafe.listConnectedWorkers());
        },

        listDirectory: testCafe.listDirectory.bind(testCafe),
        runTests: testCafe.runTests.bind(testCafe)
    }).listen(port);

    d.on('error', function () {
        testCafe.emit('remoteError');
    });

    d.on('fail', function () {
        testCafe.emit('remoteFail');
    });

    var close = testCafe.close;

    testCafe.close = function () {
        d.close();
        close.apply(testCafe);
    };

    return testCafe;
};

var Client = exports.Client = function (serverPort, serverHostname) {
    this.serverPort = serverPort;
    this.serverHostname = serverHostname;
};

Client.prototype._rpc = function (methodName, args, callback, isEvent) {
    var d = dnode.connect(this.serverPort, this.serverHostname).on('remote', function (remote) {
        args.push(function () {
            callback.apply(null, arguments);

            if (!isEvent)
                d.end();
        });

        remote[methodName].apply(remote, args);
    });
};

Client.prototype.listAvailableBrowsers = function (callback) {
    this._rpc('listAvailableBrowsers', [], callback, false);
};

Client.prototype.listConnectedWorkers = function (callback) {
    this._rpc('listConnectedWorkers', [], callback, false);
};

Client.prototype.listDirectory = function (path, callback) {
    this._rpc('listDirectory', [path], callback, false);
};

Client.prototype.runTests = function (options, callback) {
    this._rpc('runTests', [options], callback, false);
};

Client.prototype.on = function (evtName, handler) {
    this._rpc('on', [evtName], handler, true);
};

