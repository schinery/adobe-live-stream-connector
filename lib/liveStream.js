'use strict';

// Live Stream Connector.
// Reads the Adobe Live Stream and emits data over a callback. Also handles
// reconnecting and reauthentication.
//
var es = require('event-stream');
var https = require('https');
var url = require('url');
var zlib = require('zlib');

// Private variables
var auth = null;
var callback = null;
var config = null;
var isAuthenticating = false;
var dead = false;
var req = null;
var tokenValue = null;

// Constructs a new LiveStream.
// @param {Authentication} authObj - an Authentication object
// @param {Object} configObj - The configuration object with the correct details
//                          to connect to the Adobe Live Stream and Auth API
// @param {Function} callbackFunc - the callback to send errors and data to
//
function LiveStream(authObj, configObj, callbackFunc) {
  auth = authObj;
  callback = callbackFunc;
  config = configObj;
}

// Builds the Adobe Live Stream request options.
//
// @return {Object} Returns a request options object
//
function buildRequestOptions() {
  var firehoseUrl = config.streamUrl;

  if(config.maxConnections) {
    firehoseUrl += '?maxConnections=' + config.maxConnections;
  }

  var options = url.parse(firehoseUrl);

  options.headers = {
    'Authorization': 'Bearer ' + tokenValue,
    'Accept-Encoding': 'gzip'
  };

  return options;
}

// Attempts to make a connection to Adobe Live Stream
//
function connect() {
  var options = buildRequestOptions();

  req = https.request(options, function onResponse(res) {
    var isSuccessful = res.statusCode === 200;
    var isUnauthorized = res.statusCode === 401;
    var isRedirect = (res.statusCode === 301 || res.statusCode === 302) &&
      res.headers.location;

    // Note: Disabling JSHint check for unused variables for this method until I
    // can see if we can disregard the token value.
    //
    // jshint unused:false
    if(isSuccessful) {
      res.pipe(zlib.createGunzip())
        .pipe(es.split())
        .pipe(es.parse())
        .pipe(es.map(function onMap(data, cb) {
          callback(null, data);
        }));
    } else if(isUnauthorized) {
      auth.removeToken();
      callback('Stream unauthorized.');
    } else if(isRedirect) {
      config.streamUrl = res.headers.location;
      config.maxConnections = null;
    } else {
      dead = true;
      callback('Got an unexpected HTTP status ' + res.statusCode + ', aborting.');
    }
    // RE-enable jshint unused check
    // jshint unused:true
  });

  req.on('close', function onClose() {
    req = null;
    callback('Stream disconnected.');
  });

  req.on('error', function onError(error) {
    req = null;
    callback('Stream error: ' + error);
  });

  req.end();
}

// // If called will mark the stream as dead.
// //
// LiveStream.prototype.die = function() {
//   dead = true;
// };

// Check to see if the stream as dead.
//
LiveStream.prototype.isDead = function() {
  return dead;
};

// Ensures that this Adobe Live Stream connection is running. Will only
// establish a connection if one is not already in progress.
//
LiveStream.prototype.run = function() {
  if(!dead && !isAuthenticating) {
    var self = this;
    isAuthenticating = true;

    auth.getToken(function onToken(err, token) {
      isAuthenticating = false;

      if(err) {
        self.die();
        return self.callback('Got error from Adobe Authentication: ' + err);
      }

      tokenValue = token;

      if(req === null) {
        connect();
      }
    });
  }
};

module.exports = LiveStream;
