'use strict';

// Live Stream Connector.
// Reads the Adobe Live Stream and emits data over a callback. Also handles
// reconnecting and reauthentication.
//
var es = require('event-stream');
var https = require('https');
var url = require('url');
var zlib = require('zlib');

// Constructs a new LiveStream.
// @param {Authentication} auth - an Authentication object
// @param {Object} config - The configuration object with the correct details
//                          to connect to the Adobe Live Stream and Auth API
// @param {Function} callback - the callback to send errors and data to
//
function LiveStream(auth, config, callback) {
  this.auth = auth;
  this.callback = callback;
  this.config = config;
  this.isAuthenticating = false;
  this.isDead = false;
  this.req = null;
}

// Attempts to authentication. If successful then will call the connect() method.
//
// @param {Boolean} forceRefresh - specify whether to always get a new auth token
//
LiveStream.prototype.authenticate = function() {
  var self = this;
  this.isAuthenticating = true;

  this.auth.getToken(function onToken(error) {
    self.authenticating = false;

    if(error) {
      self.die();
      return self.callback('Got error from Adobe Authentication: ' + error);
    }

    self.connect();
  });
};

// Builds the Adobe Live Stream request options.
//
// @return {Object} Returns a request options object
//
LiveStream.prototype.buildRequestOptions = function() {
  var firehoseUrl = this.config.streamUrl;

  if(this.config.maxConnections) {
    firehoseUrl += '?maxConnections=' + this.config.maxConnections;
  }

  var options = url.parse(firehoseUrl);

  options.headers = {
    'Authorization': 'Bearer ' + this.auth.token.get(),
    'Accept-Encoding': 'gzip'
  };

  return options;
};

// Attempts to make a connection to Adobe Live Stream
//
LiveStream.prototype.connect = function() {
  var options = this.buildRequestOptions();
  var self = this;

  this.req = https.request(options, function onResponse(res) {
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
          self.callback(null, data);
        }));
    } else if(isUnauthorized) {
      self.adobeAuth.invalidateToken();
      self.callback('Stream unauthorized.');
    } else if(isRedirect) {
      self.config.streamUrl = res.headers.location;
      self.config.maxConnections = null;
    } else {
      self.die();
      self.callback('Got an unexpected HTTP status ' + res.statusCode + ', aborting.');
    }
    // RE-enable jshint unused check
    // jshint unused:true
  });

  this.req.on('close', function onClose() {
    self.request = null;
    self.callback('Stream disconnected.');
  });

  this.req.on('error', function onError(error) {
    self.request = null;
    self.callback('Stream error: ' + error);
  });

  this.req.end();
};

// If called will mark the stream as dead. Simple.
//
LiveStream.prototype.die = function() {
  this.isDead = true;
};

// Ensures that this Adobe Live Stream connection is running. Will only
// establish a connection if one is not already in progress.
//
LiveStream.prototype.run = function() {
  if(!this.isDead) {
    var token = this.auth.token.get();

    if(token === null && !this.isAuthenticating) {
      this.authenticate();
    } else if(token !== null && this.req === null) {
      this.connect();
    }
  }
};

module.exports = LiveStream;
