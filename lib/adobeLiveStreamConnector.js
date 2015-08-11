'use strict';

var AdobeAuth = require('./adobeAuth');
var LiveStream = require('./liveStream');

function AdobeLiveStreamConnector(config, callback) {
  this.config = config;
  this.callback = callback;
}

AdobeLiveStreamConnector.prototype.connect = function() {
  var adobeAuth = new AdobeAuth(this.config);
  var liveStream = new LiveStream(adobeAuth, this.config, this.callback);
  var self = this;

  // Method to run the main program loop, which checks to see if the stream
  // is dead, exiting the process if so.
  function programLoop() {
    if(liveStream.isDead) {
      self.callback('The stream is dead');
    }

    // If the stream disconnects or the token expires, run() ensures
    // that the stream gets re-authenticated and re-connected. Calling
    // liveStreamConnector.run() multiple times will not make more than one
    // connection.
    liveStream.run();
  }

  // Run the programLoop every loopInterval
  setInterval(programLoop, this.config.loopInterval);
};

module.exports = AdobeLiveStreamConnector;
