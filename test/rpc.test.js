var path = require('path'),
    phantomPath = require('phantomjs').path,
    phantom = require('node-phantom'),
    TestCafeRPC = require('../index');

var server = null,
    client = null;

function createWorker(name, callback) {
    phantom.create(function (err, ph) {
        return ph.createPage(function (err, page) {
            page.open('http://127.0.0.1:1337/worker/add/' + name, function () {
                callback(ph);
            });
        });
    }, {
        phantomPath: phantomPath
    });
}

module.exports = {
    setUp: function (done) {
        var cfg = {
            controlPanelPort: 1337,
            servicePort: 1338,
            testsDir: path.join(__dirname, './data'),
            browsers: {
                'Browser1': {
                    path: 'somePath'
                },
                'Browser2': {
                    path: 'somePath'
                }
            }
        };

        server = new TestCafeRPC.Server(cfg, 1339);
        client = new TestCafeRPC.Client(1339);

        done();
    },

    tearDown: function (done) {
        server.close();

        server = null;
        client = null;

        process.nextTick(function () {
            done();
        });
    },

    'listAvailableBrowsers()': function (t) {
        client.listAvailableBrowsers(function (browsers) {
            t.strictEqual(browsers.length, 2);
            t.ok(browsers.indexOf('Browser1') > -1);
            t.ok(browsers.indexOf('Browser2') > -1);

            t.done();
        });
    },

    'listConnectedWorkers()': function (t) {
        createWorker('TestWorker', function (wrkr) {
            client.listConnectedWorkers(function (workers) {
                t.strictEqual(workers.length, 1);
                t.strictEqual(workers[0], 'TestWorker');

                wrkr.exit();
                t.done();
            });
        });
    },

    'listDirectory()': function (t) {
        client.listDirectory('', function (err, dirInfo) {
            t.ok(!err);
            t.strictEqual(dirInfo.fixtures.length, 1);
            t.strictEqual(dirInfo.fixtures[0].tests.length, 11);
            t.strictEqual(dirInfo.fixtures[0].fileName, 'testcafe_example_page.test.js');

            t.done();
        });
    },

    'listDirectory() - non-existent path': function (t) {
        client.listDirectory('Ooops', function (err, dirInfo) {
            t.ok(err);
            t.ok(!dirInfo);

            t.done();
        });
    },

    'runTests()': function (t) {
        client.listDirectory('', function (err, dirInfo) {
            createWorker('DaWorkingHorse', function (wrkr) {
                var opt = {
                    sourceType: 'test',
                    source: dirInfo.fixtures[0].tests[0].uid,
                    workers: ['DaWorkingHorse'],
                    emulateCursor: false
                };

                client.runTests(opt, function (errs, taskUid, workers) {
                    t.ok(!errs);
                    t.ok(taskUid);
                    t.strictEqual(workers.length, 1);
                    t.strictEqual(workers[0], 'DaWorkingHorse');

                    wrkr.exit();
                    t.done();
                });
            });
        });
    },

    'runTests() - with errors': function (t) {
        var opt = {
            workers: ['DaWorkingHorse'],
            emulateCursor: false
        };

        client.runTests(opt, function (errs, taskUid, workers) {
            t.ok(errs);
            t.ok(!taskUid);
            t.ok(!workers);

            t.done();
        });
    },

    'Events: workerAdded': function (t) {
        client.on('workerAdded', function (workerName) {
            t.strictEqual(workerName, 'NewWorker');
            t.done();
        });

        createWorker('NewWorker', function (wrkr) {
            wrkr.exit();
        });
    },

    'Events: taskUpdated and taskCompleted': function (t) {
        client.listDirectory('', function (err, dirInfo) {
            createWorker('DaWorkingHorse', function (wrkr) {
                var opt = {
                        sourceType: 'test',
                        source: dirInfo.fixtures[0].tests[0].uid,
                        workers: ['DaWorkingHorse'],
                        emulateCursor: false
                    },
                    taskUpdatedUid = null;

                client.on('taskUpdated', function (report) {
                    t.ok(report.status);
                    t.ok(report.name);
                    taskUpdatedUid = report.uid;
                });


                client.runTests(opt, function (errs, taskUid, workers) {
                    client.on('taskComplete', function (report) {
                        t.ok(report.status);
                        t.ok(report.name);
                        t.strictEqual(report.uid, taskUid);
                        t.strictEqual(report.uid, taskUpdatedUid);

                        wrkr.exit();
                        t.done();
                    });
                });
            });
        });
    }
};
