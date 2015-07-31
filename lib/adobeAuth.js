'use strict';

// Adobe Authentication
//
// Communicates with the Adobe API token servers and caches
// tokens locally.
//
var fs = require('fs');
var https = require('https');
var querystring = require('querystring');

// Constructs a new AdobeAuth object.
//
// @param {Object} config - The configuration object with the correct details
//                          to connect to the Adobe Live Stream and Auth API.
//
function AdobeAuth(config) {
  this.config = config;
  this.tokenCacheFile = config.tokenCacheFile;
  this.token = null;
  this.readCachedToken();
}

// Builds the Adobe Authenticaton request options
//
// @return {Object} Returns a request options object
//
AdobeAuth.prototype.buildRequestOptions = function() {
  var options = {
    agent: false,
    auth: this.config.clientId + ':' + this.config.clientSecret,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    hostname: this.config.tokenApiHost,
    method: 'POST',
    path: '/token',
    port: 443
  };

  return options;
};

// Attempts to read the token from the filesystem. Will set the token value if
// successfully read.
//
// @return {Boolean} Returns true if successfully loaded.
//
AdobeAuth.prototype.readCachedToken = function() {
  var data = '';

  try {
    data = fs.readFileSync(this.tokenCacheFile);

    if(data.length > 20) {
      console.log('Successfully read token from cache.');
      this.token = data;
      return true;
    }

    console.log('Cached token was not long enough (expected 20 bytes), discarding.');
  } catch(error) {
    console.log('Cached token file could not be found or wasn\'t readable. ' + error);
  }

  return false;
};

// Persists the obtained token to the filesystem.
//
AdobeAuth.prototype.cacheToken = function() {
  var tokenCacheFile = this.tokenCacheFile;

  fs.writeFile(tokenCacheFile, this.token, function writeTokenFile(error) {
    if(error) {
      console.log('Cached token file could not be created or overwritten. ' + error);
    } else {
      console.log('Successfully wrote cached token to ' + tokenCacheFile);
    }
  });
};

// Requests a token from the token service, reading from cache for efficiency.
//
// @param {Boolean} forceRefresh - specify whether to always get a new auth token
// @param {Function} callback - the callback to use after attempting to get a
//                              new token
//
AdobeAuth.prototype.getToken = function(forceRefresh, callback) {
  if(this.token === null || forceRefresh) {
    return this.requestToken(callback);
  }

  if(callback) {
    callback(null, this.token);
  }
};

// Requests a new token for the Adobe Authentication API, responding on the
// callback when complete. Use getToken() instead of calling this function
// directly.
//
// @param {Function} callback - the callback to use after attempting to get a
//                              new token
//
AdobeAuth.prototype.requestToken = function(callback) {
  this.token = null; // clear out old token

  var auth = this;
  var buffer = '';
  var options = this.buildRequestOptions();
  var postData = querystring.stringify({
    'grant_type': 'client_credentials'
  });

  var req = https.request(options, function onResponse(res) {
    res.setEncoding('utf8');

    res.on('data', function onData(chunk) {
      buffer += chunk;
    });
  });

  req.on('close', function onClose() {
    var authResult = null;
    var reqError = null;

    if(buffer === '') {
      reqError = 'Did not receive any output from token server.';
    } else {
      try {
        authResult = JSON.parse(buffer);
      } catch(err) {
        reqError = 'Could not parse JSON output ' + err;
      }

      if(authResult && authResult.access_token) {
        auth.token = authResult.access_token;
        auth.cacheToken();
      }

      if(authResult && authResult.error) {
        reqError = authResult.error_description;
      }
    }

    if(callback) {
      callback(reqError, auth.token);
    }
  });

  req.on('error', function onError(e) {
    if(callback) {
      callback('Got request serialization error: ' + e);
    }
  });

  req.write(postData);
  req.end();
};

// Invalidates the current token, presumably because it didn't authorize the request.
//
AdobeAuth.prototype.invalidateToken = function() {
  this.token = null;
};

module.exports = AdobeAuth;
