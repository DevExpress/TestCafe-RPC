# ⚠️This package is now deprecated⚠️
It is not compatible with [TestCafe v1.x](https://testcafe.io), and will receive no future updates. We highly recommend all `testcafe-rpc` users migrate to a recent version of TestCafe. Visit [https://testcafe.io](https://testcafe.io) to learn how.

TestCafe RPC
======
RPC library for [TestCafé v2015.1](http://testcafe.devexpress.com/). It allows you to create a single instance of TestCafé v2015.1, and interact with it programmatically from any machine in your network.


Install
-------
```
$ npm install testcafe-rpc
```

Running a server
-------------
```js
var TestCafeRemote = require('testcafe-rpc');

//Options for TestCafé instance
var opt = {
        controlPanelPort: 1337,
        servicePort: 1338,
        testsDir: 'YOUR_TESTS_DIR',
        browsers: {
            'Mozilla Firefox': {
                path: "C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe",
                icon: "ff",
                cmd: "-new-window"
            }
        }
    },
    rpcPort = 1339;

//Create TestCafé server instance with given options which can be accessed via RPC on port 1339.
var testCafeServer = new TestCafeRemote.Server(opt, rpcPort);

//Returned object exposes standard TestCafé API, so you can use it as a regular TestCafé instance.
testCafeServer.runTests({ browsers: testCafeServer.listAvailableBrowsers() }, function (errors, taskUid, workers) {
    //do smthg...
});
```

Running a client
-------------
```js
var TestCafeRemote = require('testcafe-rpc');

var rpcHostname = 'myhostname',
    rpcPort = 1339;

//Connect to the existent TestCafé server (if your client and server are running on the same machine
//the hostname parameter can be ommited).
var testCafeClient = new TestCafeRemote.Client(rpcPort, rpcHostname);

//Client can be used as a regular TestCafé instance with exception that listAvailableBrowsers() and listConnectedWorkers()
//are asynchronous methods.
testCafeClient.listAvailableBrowsers(function(browsers) {
    testCafeClient.runTests({ browsers: browsers }, function (errors, taskUid, workers) {
      //do smthg...
    });
});
```
Need more help to get started?
--------------
Read the [Continuous integration guide](http://testcafe.devexpress.com/Documentation/Tutorial/Continuous_Integration) and the [Continuous integration API reference](http://testcafe.devexpress.com/Documentation/ApiReference/Continuous_Integration_API_Reference) to learn more.
