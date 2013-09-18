TestCafe RPC
======
RPC library for the [TestCafé](http://testcafe.devexpress.com/). It allows you to create a single TestCafé instance and then interact with it programmatically from any machine in your network.


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

//Connect to the existent TestCafé server (if you running both client and server on the same machine
//hostname-parameter can be ommited).
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
Visit TestCafé  [Continuous integration guide](http://testcafe.devexpress.com/Documentation/Tutorial/Continuous_Integration) and [Continuous integration API reference](http://testcafe.devexpress.com/Documentation/ApiReference/Continuous_Integration_API_Reference). If you have any additional questions or suggestions don't hesitate to ask using [DevExpress Support Center](http://www.devexpress.com/Support/Center/Question/ChangeFilterSet/1?FavoritesOnly=False&MyItemsOnly=False&MyTeamItemsOnly=False&TechnologyName=Testing+Tools&PlatformName=AllPlatforms&ProductName=AllProducts&TicketType=All).

License
----------
Copyright (c) 2013 DevExpress (www.devexpress.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


