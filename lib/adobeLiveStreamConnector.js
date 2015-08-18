'use strict';

// var AdobeAuth = require('./adobeAuth');
var Authentication = require('./authentication');
var Cache = require('./cache');
var LiveStream = require('./liveStream');
var Token = require('./token');

// Private variables
var config = null;
var callback = null;

function AdobeLiveStreamConnector(configObj, callbackFunc) {
  config = configObj;
  callback = callbackFunc;
}

AdobeLiveStreamConnector.prototype.connect = function() {
  var cache = new Cache();
  var token = new Token(cache);
  var auth = new Authentication(token, config);
  var stream = new LiveStream(auth, config, callback);

  // Method to run the main program loop, which checks to see if the stream
  // is dead, exiting the process if so.
  function programLoop() {
    if(stream.isDead) {
      callback('The stream is dead');
    }

    // If the stream disconnects or the token expires, run() ensures
    // that the stream gets re-authenticated and re-connected. Calling
    // liveStreamConnector.run() multiple times will not make more than one
    // connection.
    stream.run();
  }

  // Run the programLoop every loopInterval
  setInterval(programLoop, config.loopInterval);
};

module.exports = AdobeLiveStreamConnector;
